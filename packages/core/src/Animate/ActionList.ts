import { Action } from "@/Animate/Action";
import { Window } from "@/Animate/Window";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import type { RenderNode } from "@/Renderer/RenderNode";

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
  actionsList: ActionLinkList;
  lazyActions: Array<Action>;
  enabled: boolean;
  constructor() {
    this.t = 0;
    this.zeroCount = 0; // action (l = 0 & r = 0)
    this.stopCount = 0; // action (hide = false & stop = true)
    this.validCount = 0; // action (hide = false)
    this.totalCount = 0; // action (by push)
    this.actionsMap = new Map();
    this.actionsList = new ActionLinkList();
    this.lazyActions = [];
    this.enabled = false;
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
        `Action conflict on ${action1.animatedKey} when [${action1.l}, ${action1.r}] and [${action2.l}, ${action2.r}]`,
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
                `Action conflict on ${action.animatedKey} and ${key} when [${action.l}, ${action.r}] and [${conflictedAction.l}, ${conflictedAction.r}]`,
              );
          }
        }
      }
    }
    hideActionList.forEach((action_) => {
      if (action !== action_) {
        actionMap[action_.animatedKey] = actionMap[action_.animatedKey].filter(
          (a) => a !== action_,
        );
        this.actionsList.erase(action_);
      }
      const index = this.lazyActions.indexOf(action_);
      if (index !== -1) this.lazyActions.splice(index, 1);
    });
  }
  firstTick() {
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
      if (action.is(Action.stopFlag)) this.stopCount++;
    });
  }
  restart() {
    this.actionsList.forEach((action) => {
      action.unset(Action.stopFlag);
    });
  }
  forceToFinish() {
    this.actionsList.forEach((action) => {
      if (action.is(Action.stopFlag)) return;
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
    return stopCount === totalCount;
  }
  rollback() {
    const list = new ActionList();
    let maxTimestamp = 0;
    this.actionsList.forEach((action) => {
      maxTimestamp = Math.max(maxTimestamp, action.r);
    });
    this.actionsList.forEachReverse((action) => {
      const action_ = action.clone();
      if (!action_) return;
      action_.reverse = true;
      action_.l = maxTimestamp - action.r;
      action_.r = maxTimestamp - action.l;
      action_.source = action.target;
      action_.target = action.source;
      action_._source = action._target;
      action_._target = action._source;
      const timingFunction = action.timingFunction;
      action_.timingFunction = (t: number) => {
        return 1.0 - timingFunction(1.0 - t);
      };
      list.push(action_);
    });
    list.enabled = true;
    return list;
  }
  replay() {
    const other = new ActionList();
    this.actionsList.forEach((action) => {
      const action_ = action.clone();
      if (!action_) return;
      other.push(action_);
    });
    other.enabled = true;
    return other;
  }
  // Every entity that has any action queued — not just size-related ones —
  // contributes its math bounds, so animations whose geometry is set
  // statically at construction still register.
  updateWindowSize() {
    this.actionsMap.forEach((_, entity) => {
      if (entity instanceof SDSVGNode && visible(entity)) {
        Window.MATH_MINX = Math.min(Window.MATH_MINX, entity.getX());
        Window.MATH_MINY = Math.min(Window.MATH_MINY, entity.getY());
        Window.MATH_MAXX = Math.max(Window.MATH_MAXX, entity.getMaxX());
        Window.MATH_MAXY = Math.max(Window.MATH_MAXY, entity.getMaxY());
      }
    });
  }
  getAttribute(
    entity: SDNode | RenderNode,
    animatedKey: string,
    t: number,
    default_?: any,
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
      if (default_ !== undefined) return default_;
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
