import type { Action } from "@/Animate/Action";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { SDNode } from "@/sd";

import { ActionList } from "@/Animate/ActionList";
import { Window } from "@/Animate/Window";
import { Status as S } from "@/Interact/Status";
import { Dom } from "@/Utility/Dom";

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
    default_?: any,
  ) {
    return this.currentActionList.getAttribute(
      entity,
      animatedKey,
      t,
      default_,
    );
  }
  static debug() {
    this.currentActionList.debug();
  }
}

if (typeof requestAnimationFrame !== "undefined")
  requestAnimationFrame(Animate.animationRequest);
