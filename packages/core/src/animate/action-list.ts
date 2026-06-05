import type { RenderNode } from "@/renderer/render-node";

import { Action } from "@/animate/action";
import { ParametricAction } from "@/animate/parametric-action";
import { Window } from "@/animate/window";
import { Root } from "@/interact/root";
import { SDNode } from "@/node/node";
import { SDSVGNode } from "@/node/svg-node";

// the animatedKey which will impact the shape (boundingBox) of an element
const SIZE_RELATED_KEY = new Set([
  "x",
  "y",
  "cx",
  "cy",
  "width",
  "height",
  "d",
  "x1",
  "y1",
  "x2",
  "y2",
  "transform",
  "opacity",
  "font-size",
  "points",
  "left",
  "top",
]);

const entityLabel = (entity: unknown): string => {
  if (entity && typeof entity === "object") {
    const ctor = (entity as { constructor?: { name?: string } }).constructor;
    if (ctor && ctor.name) return ctor.name;
  }
  return "entity";
};

const visible = (element: SDNode): boolean => {
  if (!(element instanceof SDNode)) return false;
  if (element.getOpacity() === 0) return false;
  if (element.parent) return visible(element.parent);
  return true;
};

const isInstantaneous = (action: Action) => {
  return action.l === action.r;
};

const isCompleteOverlap = (action1: Action, action2: Action) => {
  return action1.l === action2.l && action2.r === action1.r;
};

const isPartialOverlap = (action1: Action, action2: Action) => {
  if (action1.r <= action2.l) return false;
  if (action2.r <= action1.l) return false;
  if (isCompleteOverlap(action1, action2)) return false;
  if (
    isInstantaneous(action1) &&
    (action1.l === action2.l || action1.l === action2.r)
  )
    return false;
  if (
    isInstantaneous(action2) &&
    (action2.l === action1.l || action2.l === action1.r)
  )
    return false;
  return true;
};

class ActionLinkList {
  head: Action;
  tail: Action;
  constructor() {
    this.head = undefined;
    this.tail = undefined;
  }
  push(element: Action) {
    if (!this.tail) {
      this.head = this.tail = element;
    } else {
      this.tail.next = element;
      element.prev = this.tail;
      this.tail = element;
    }
  }
  erase(element: Action) {
    if (element === this.head && element === this.tail) {
      this.head = this.tail = undefined;
    } else if (element === this.head) {
      this.head = element.next;
      this.head.prev = undefined;
    } else if (element === this.tail) {
      this.tail = element.prev;
      this.tail.next = undefined;
    } else {
      const prev = element.prev;
      const next = element.next;
      prev.next = next;
      next.prev = prev;
    }
  }
  forEach(callback: (element: Action) => void) {
    for (let element = this.head; element; element = element.next)
      callback(element);
  }
  forEachReverse(callback: (element: Action) => void) {
    for (let element = this.tail; element; element = element.prev)
      callback(element);
  }
}

export class ActionList {
  t: number;
  zeroCount: number;
  stopCount: number;
  validCount: number;
  totalCount: number;
  actionsMap: Map<SDNode | RenderNode, Record<string, Array<Action>>>;
  currentValueMap: Map<SDNode | RenderNode, Record<string, unknown>>;
  actionsList: ActionLinkList;
  lazyActions: Array<Action>;
  parametricList: Array<ParametricAction>;
  enabled: boolean;
  constructor() {
    this.t = 0;
    this.zeroCount = 0; // action (l = 0 & r = 0)
    this.stopCount = 0; // action (hide = false & stop = true)
    this.validCount = 0; // action (hide = false)
    this.totalCount = 0; // action (by push)
    this.actionsMap = new Map();
    this.currentValueMap = new Map();
    this.actionsList = new ActionLinkList();
    this.lazyActions = [];
    this.parametricList = [];
    this.enabled = false;
  }
  pushParametric(action: ParametricAction) {
    this.totalCount++;
    this.parametricList.push(action);
    this.validCount++;
  }
  push(action: Action) {
    if (action.lazyInterp) this.pushLazyAction(action);
    this.pushAction(action);
  }
  pushLazyAction(action: Action) {
    this.lazyActions.push(action);
  }
  pushAction(action: Action) {
    this.totalCount++;
    this.trim(action);
    if (!this.actionsMap.has(action.entity))
      this.actionsMap.set(action.entity, {});
    const actionMap = this.actionsMap.get(action.entity);
    if (action.animatedKey.indexOf(":") === -1) {
      let entityCurrentMap = this.currentValueMap.get(action.entity);
      if (!entityCurrentMap) {
        entityCurrentMap = {};
        this.currentValueMap.set(action.entity, entityCurrentMap);
      }
      if (!(action.animatedKey in entityCurrentMap))
        entityCurrentMap[action.animatedKey] = action.source;
    }
    if (!actionMap[action.animatedKey]) actionMap[action.animatedKey] = [];
    actionMap[action.animatedKey].push(action);
    this.actionsList.push(action);
    if (!action.is(Action.hideFlag)) {
      this.validCount++;
      if (action.is(Action.stopFlag)) this.stopCount++;
    }
  }
  checkConflict(
    action1: Action,
    action2: Action,
    hideAction: (action: Action) => void,
  ) {
    if (
      isInstantaneous(action1) &&
      isInstantaneous(action2) &&
      action1.l === action2.l
    ) {
      action2.source = action1.source;
      hideAction(action1);
    }
    if (isCompleteOverlap(action1, action2)) {
      action2.source = action1.source;
      hideAction(action1);
    }
    if (isPartialOverlap(action1, action2)) {
      throw new Error(
        `Action conflict on ${entityLabel(action1.entity)}.${action1.animatedKey} when [${action1.l}, ${action1.r}] and [${action2.l}, ${action2.r}]`,
      );
    }
  }
  trim(action: Action) {
    const actionMap = this.actionsMap.get(action.entity);
    if (!actionMap) return;
    const hideActionList: Array<Action> = [];
    const hideAction = (action: Action) => {
      if (action.is(Action.hideFlag)) return;
      action.set(Action.hideFlag);
      hideActionList.push(action);
      if (action.is(Action.stopFlag)) this.stopCount--;
      this.validCount--;
    };
    const animatedKey = action.animatedKey;
    const otherActions = actionMap[animatedKey] ?? [];
    otherActions.forEach((otherAction) => {
      this.checkConflict(otherAction, action, hideAction);
    });
    const prefixLength = animatedKey.indexOf(":");
    if (prefixLength !== -1) {
      const intersectCheck = (actions: Action | Array<Action>) => {
        if (Array.isArray(actions))
          return actions.find((action) => intersectCheck(action));
        return (
          isCompleteOverlap(action, actions) ||
          isPartialOverlap(action, actions)
        );
      };
      const prefix = animatedKey.slice(0, prefixLength + 1);
      const suffix = animatedKey.slice(prefixLength + 1);
      if (suffix === "*") {
        for (const key in actionMap) {
          if (!key.startsWith(prefix) || key === animatedKey) continue;
          if (intersectCheck(actionMap[key])) hideAction(action);
        }
      } else {
        for (const key in actionMap) {
          if (!key.startsWith(prefix) || key === animatedKey) continue;
          if (key.endsWith("*")) {
            actionMap[key].forEach((action) => {
              if (intersectCheck(action)) hideAction(action);
            });
          } else {
            const conflictedAction = intersectCheck(actionMap[key]);
            if (conflictedAction)
              throw new Error(
                `Action conflict on ${entityLabel(action.entity)}.${action.animatedKey} and ${key} when [${action.l}, ${action.r}] and [${conflictedAction.l}, ${conflictedAction.r}]`,
              );
          }
        }
      }
    }
    hideActionList.forEach((sibling) => {
      if (action !== sibling) {
        actionMap[sibling.animatedKey] = actionMap[sibling.animatedKey].filter(
          (other) => other !== sibling,
        );
        this.actionsList.erase(sibling);
      }
      const index = this.lazyActions.indexOf(sibling);
      if (index !== -1) this.lazyActions.splice(index, 1);
    });
  }
  firstTick() {
    for (const [entity, record] of this.actionsMap) {
      const currentMap = this.currentValueMap.get(entity);
      for (const key of Object.keys(record)) {
        if (key.indexOf(":") !== -1) continue;
        const actions = record[key].filter((a) => !a.is(Action.hideFlag));
        if (actions.length < 2) continue;
        actions.sort((a, b) => a.l - b.l);
        actions[0].source = currentMap?.[key];
        for (let i = 1; i < actions.length; i++)
          actions[i].source = actions[i - 1].target;
      }
    }
    this.lazyActions.forEach((action) => {
      action.lazyInterp(action.l, action.r, action.source, action.target);
    });
    this.lazyActions = [];
  }
  tick(t: number) {
    this.t = t;
    if (this.stopCount === this.validCount) return;
    this.actionsList.forEach((action) => {
      if (action.is(Action.stopFlag)) return;
      if (!action.t) action.t = t;
      const duration = this.t - action.t;
      action.tick(duration);
      if (action.is(Action.stopFlag)) {
        this.stopCount++;
        if (action.animatedKey.indexOf(":") === -1) {
          let entityCurrentMap = this.currentValueMap.get(action.entity);
          if (!entityCurrentMap) {
            entityCurrentMap = {};
            this.currentValueMap.set(action.entity, entityCurrentMap);
          }
          entityCurrentMap[action.animatedKey] = action.target;
        }
      }
    });
    this.parametricList.forEach((action) => {
      if (action.is(ParametricAction.stopFlag)) return;
      if (!action.t) action.t = t;
      action.tick(this.t - action.t);
      if (action.is(ParametricAction.stopFlag)) this.stopCount++;
    });
  }
  restart() {
    this.actionsList.forEach((action) => {
      action.unset(Action.stopFlag);
    });
    this.parametricList.forEach((action) => {
      action.unset(ParametricAction.stopFlag);
      action.set(ParametricAction.firstCallFlag);
      action.t = 0;
    });
  }
  forceToFinish() {
    this.actionsList.forEach((action) => {
      if (action.is(Action.stopFlag)) return;
      action.forceToFinish();
      this.stopCount++;
    });
    this.parametricList.forEach((action) => {
      if (action.is(ParametricAction.stopFlag)) return;
      action.forceToFinish();
      this.stopCount++;
    });
  }
  finished() {
    let stopCount = 0;
    let totalCount = 0;
    this.actionsList.forEach((action) => {
      if (action.is(Action.stopFlag)) stopCount++;
      totalCount++;
    });
    this.parametricList.forEach((action) => {
      if (action.is(ParametricAction.stopFlag)) stopCount++;
      totalCount++;
    });
    return stopCount === totalCount;
  }
  rollback() {
    const list = new ActionList();
    let maxTimestamp = 0;
    this.actionsList.forEach((action) => {
      maxTimestamp = Math.max(maxTimestamp, action.r);
    });
    this.actionsList.forEachReverse((action) => {
      const cloned = action.clone();
      if (!cloned) return;
      cloned.reverse = true;
      cloned.l = maxTimestamp - action.r;
      cloned.r = maxTimestamp - action.l;
      cloned.source = action.target;
      cloned.target = action.source;
      cloned.preparedSource = action.preparedTarget;
      cloned.preparedTarget = action.preparedSource;
      const timingFunction = action.timingFunction;
      cloned.timingFunction = (t: number) => {
        return 1.0 - timingFunction(1.0 - t);
      };
      list.push(cloned);
    });
    list.enabled = true;
    return list;
  }
  replay() {
    const other = new ActionList();
    this.actionsList.forEach((action) => {
      const cloned = action.clone();
      if (!cloned) return;
      other.push(cloned);
    });
    other.enabled = true;
    return other;
  }
  // Every entity in the scene contributes its math bounds — animated AND
  // purely static. The actionsMap walk catches animated entities (still
  // useful because parametric / mid-tween coverage is registered there);
  // the Root.group walk picks up the static rest. Without the latter, a
  // purely-static anim never registered any geometry and the viewBox fell
  // back to the default centered (-600, -300, 1200, 600) — content placed
  // in any quadrant of math space drifted off-canvas.
  updateWindowSize() {
    this.actionsMap.forEach((_, entity) => {
      if (entity instanceof SDSVGNode && visible(entity)) {
        const box = entity.getWorldAABB();
        Window.MATH_MINX = Math.min(Window.MATH_MINX, box.x);
        Window.MATH_MINY = Math.min(Window.MATH_MINY, box.y);
        Window.MATH_MAXX = Math.max(Window.MATH_MAXX, box.x + box.width);
        Window.MATH_MAXY = Math.max(Window.MATH_MAXY, box.y + box.height);
      }
    });
    const rootBox = Root.group.getWorldAABB();
    if (
      isFinite(rootBox.x) &&
      isFinite(rootBox.y) &&
      (rootBox.width > 0 || rootBox.height > 0)
    ) {
      Window.MATH_MINX = Math.min(Window.MATH_MINX, rootBox.x);
      Window.MATH_MINY = Math.min(Window.MATH_MINY, rootBox.y);
      Window.MATH_MAXX = Math.max(Window.MATH_MAXX, rootBox.x + rootBox.width);
      Window.MATH_MAXY = Math.max(Window.MATH_MAXY, rootBox.y + rootBox.height);
    }
    // tween contributes a world-space bbox directly when bounds is set —
    // entity at fn(1) is already in actionsMap via push, so the endpoint
    // bbox is covered above; bounds only needs to add mid-tween extremes.
    this.parametricList.forEach((action) => {
      if (!action.bounds) return;
      if (!visible(action.entity)) return;
      const bx = action.bounds.x;
      const by = action.bounds.y;
      if (bx) {
        Window.MATH_MINX = Math.min(Window.MATH_MINX, bx[0]);
        Window.MATH_MAXX = Math.max(Window.MATH_MAXX, bx[1]);
      }
      if (by) {
        Window.MATH_MINY = Math.min(Window.MATH_MINY, by[0]);
        Window.MATH_MAXY = Math.max(Window.MATH_MAXY, by[1]);
      }
    });
  }
  getAttribute(
    entity: SDNode | RenderNode,
    animatedKey: string,
    t: number,
    defaultValue?: any,
  ) {
    const actionMap = this.actionsMap.get(entity);
    if (!actionMap) return;
    const actions = actionMap[animatedKey] ?? [];
    let value = undefined;
    actions.forEach((action) => {
      if (action.l === t) value = action.source;
      if (action.r === t) value = action.target;
    });
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Unable to find attribute ${animatedKey}`);
    }
    return value;
  }
  debug() {
    console.log("---------------Action List debug---------------");
    let used = 0;
    this.actionsList.forEach((action) => {
      console.log(action.toString(), action);
      used++;
    });
    console.log(
      "input action count =",
      this.totalCount,
      "used action count =",
      this.validCount,
      "rate =",
      this.validCount / this.totalCount,
    );
    console.log("---------------Action List debug---------------");
    console.log("");
  }
}
