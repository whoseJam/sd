import type {
  InterpFunction,
  InterpKind,
  LazyInterpKind,
} from "@/animate/interp";
import type { RenderNode } from "@/renderer/render-node";
import type { SDNode } from "@/sd";

import { Action } from "@/animate/action";
import { ActionList } from "@/animate/action-list";
import { Window } from "@/animate/window";
import { Status as S } from "@/interact/status";
import { Dom } from "@/utility/dom";

let checkWaterMarkTick = 0;
const WATER_MARK_CHECK_INTERVAL = 100;
const WATER_MARK_STRING = "pow" + "er b" + "y wh" + "oseJ" + "am";

export function createWaterMark() {
  const watermark = Dom.createElementAndAppendToBody("div");
  watermark.innerHTML = `
    <div id="watermark" style="position: fixed; bottom: 10px; right: 10px; font-size: 15px; color: rgba(0, 0, 0, 0.3); pointer-events: none;">
    ${WATER_MARK_STRING}
    </div>
    `;
}

function checkWaterMark() {
  checkWaterMarkTick++;
  if (checkWaterMarkTick >= WATER_MARK_CHECK_INTERVAL) {
    checkWaterMarkTick = 0;
    if (Dom.getByID("watermark")) return;
    createWaterMark();
  }
}

export class Animate {
  static lastTickFlag = false;
  static currentTimestamp = 0;
  static historyActionList = {};
  static currentActionList = new ActionList();
  static shouldStop = false;
  static animationRequest = Animate.tick.bind(Animate);
  static count = 0;
  static trigger() {
    this.count++;
  }
  static stop() {
    this.shouldStop = true;
  }
  static start() {
    if (this.shouldStop) {
      this.shouldStop = false;
      requestAnimationFrame(this.animationRequest);
    }
  }
  static firstTick() {
    const currentActionList = this.currentActionList;
    currentActionList.firstTick();
  }
  static tick(t: number) {
    checkWaterMark();
    this.currentTimestamp = t;
    const currentActionList = this.currentActionList;
    if (Window.SHOULD_FLUSH || this.shouldStop) return;
    if (
      this.count ||
      (currentActionList.enabled && !currentActionList.finished())
    ) {
      if (!currentActionList.enabled) {
        currentActionList.enabled = true;
        this.count--;
        currentActionList.firstTick();
      }
      currentActionList.tick(t);
    }
    requestAnimationFrame(this.animationRequest);
  }
  static finished() {
    return this.currentActionList.finished();
  }
  static forceToFinish() {
    this.currentActionList.forceToFinish();
  }
  static push(action: Action) {
    const currentActionList = this.currentActionList;
    action.t = this.currentTimestamp;
    currentActionList.push(action);
  }
  static startNewFrame() {
    const frame = ++Window.CURRENT_FRAME;
    Window.MAXIMUM_FRAME = Math.max(Window.CURRENT_FRAME, Window.MAXIMUM_FRAME);
    const lastFrame = frame - 1;
    if (!this.historyActionList[lastFrame]) {
      this.historyActionList[lastFrame] = this.currentActionList;
    }
    this.currentActionList = new ActionList();
    S.updateFrameStatus();
  }
  static rollbackFrame() {
    const nextFrame = Window.CURRENT_FRAME;
    if (nextFrame === Window.MAXIMUM_FRAME)
      this.historyActionList[nextFrame] = this.currentActionList;
    if (nextFrame < 0) return;
    Window.CURRENT_FRAME--;
    if (!this.historyActionList[nextFrame]) {
      this.historyActionList[nextFrame] = this.currentActionList;
    }
    this.currentActionList = this.historyActionList[nextFrame].rollback();
    this.currentActionList.restart();
    S.updateFrameStatus();
  }
  static replayFrame() {
    let frame = ++Window.CURRENT_FRAME;
    this.currentActionList = this.historyActionList[frame].replay();
    this.currentActionList.restart();
    S.updateFrameStatus();
  }
  static getAttribute(
    entity: SDNode | RenderNode,
    animatedKey: string,
    t: number,
    defaultValue?: any,
  ) {
    return this.currentActionList.getAttribute(
      entity,
      animatedKey,
      t,
      defaultValue,
    );
  }
  static debug() {
    this.currentActionList.debug();
  }
}

if (typeof requestAnimationFrame !== "undefined")
  requestAnimationFrame(Animate.animationRequest);

// Sole entry point for creating + enqueuing an animation action. `from`
// and `to` are inferred from `interp` so colorInterp + from: 5 is a TS
// error rather than a runtime crash. Direct `new Action(...)` callers
// remain valid during the migration but should be replaced over time.
interface PushActionOptions<I extends InterpKind<unknown, unknown>> {
  entity: SDNode | RenderNode;
  key: string;
  l: number;
  r: number;
  from: NonNullable<I["fromType"]>;
  to: NonNullable<I["toType"]>;
  interp: I;
  timing: (t: number) => number;
}

export function pushAction<I extends InterpKind<unknown, unknown>>(
  options: PushActionOptions<I>,
): void {
  Animate.push(
    new Action(
      options.l,
      options.r,
      options.from,
      options.to,
      options.interp(options.entity, options.key),
      options.timing,
      options.entity,
      options.key,
    ),
  );
}

// Sibling of pushAction for lazy interps — the interp is the callback
// itself (evaluated by the scheduler at endpoint), and source/target
// types are still tied to the interp via the LazyInterpKind phantoms.
interface PushLazyActionOptions<I extends LazyInterpKind<unknown, unknown>> {
  entity: SDNode | RenderNode;
  key: string;
  l: number;
  r: number;
  from: NonNullable<I["fromType"]>;
  to: NonNullable<I["toType"]>;
  interp: I;
  timing: (t: number) => number;
}

export function pushLazyAction<I extends LazyInterpKind<unknown, unknown>>(
  options: PushLazyActionOptions<I>,
): void {
  Animate.push(
    new Action(
      options.l,
      options.r,
      options.from,
      options.to,
      options.interp,
      options.timing,
      options.entity,
      options.key,
    ),
  );
}

// Structural / mount actions: not animating an attribute, just running
// a callback at endpoints to mutate the render tree (append, insert,
// remove). from/to are RenderNode refs the callback reads via
// `this.target` / `this.source`.
interface PushLifecycleOptions {
  entity: SDNode | RenderNode;
  key: string;
  l: number;
  r: number;
  from: RenderNode | undefined;
  to: RenderNode | undefined;
  callback: InterpFunction;
  timing: (t: number) => number;
}

export function pushLifecycle(options: PushLifecycleOptions): void {
  Animate.push(
    new Action(
      options.l,
      options.r,
      options.from,
      options.to,
      options.callback,
      options.timing,
      options.entity,
      options.key,
    ),
  );
}
