import { Animate as A } from "@/Animate/Animate";
import { Device as D } from "@/Interact/Device";
import { Root } from "@/Interact/Root";
import { Status as S, Status } from "@/Interact/Status";

export const NORMAL_FRAME = -1;
export const LAST_MAIN_STAGE = -2;
export const LAST_INTER_STAGE = -3;
export const FIRST_INTER_STAGE = -4;
export const CONTINUE_STAGE = -5;

export class Window {
  static DEBUG = true;
  static RATE = 1;
  static ACTION_TICK = 0;
  static ACTION_DELAY = 0;
  // 专门给 Base.loopUpdate 的优化标志。loopUpdate 里用户每帧自己算新状态，
  // 这时 triggerAttributeChanged 没必要再 push Action 走 Interp 插值——
  // 既不对（下一帧又被覆盖）也浪费。loopUpdate 在回调前后 toggle 这个 flag，
  // 让 setter 的写改走 renderAttribute 直接落 DOM。
  // 不要把这个 flag 当通用"同步写 DOM"开关用。
  static SHOULD_INTERP = true;
  static CURRENT_FRAME = 0;
  static MAXIMUM_FRAME = 0;
  static WHOSEJAM = 0;
  static SHOULD_EXPORT = false;
  static SHOULD_FLUSH = false;
  static IS_CONTINUING = false;
  static IS_INTERACTING = false;
  static MATH_MINX = Infinity;
  static MATH_MINY = Infinity;
  static MATH_MAXX = -Infinity;
  static MATH_MAXY = -Infinity;
  static PUPPETEER = false;
  static IFRAME_ID = undefined;
  static IFRAME_URL = undefined;
  static IFRAME_RATE = undefined;
  static IFRAME_MAX_FRAME = Infinity;
  static IFRAME_INITED = true;
  static IFRAME_ARGS = {};
  static attributes = {};
  static init() {
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (data.operator && data.arguments)
        Window[data.operator].apply(Window, data.arguments);
    });
    window.parent.postMessage("inited", "*");
  }
  static Message(key: string, value: any) {
    this.attributes[key] = value;
  }
  static Flush(
    id: number,
    url: string,
    rate: number,
    pdf: boolean,
    maxFrame = Infinity,
  ) {
    this.SHOULD_FLUSH = true;
    this.SHOULD_EXPORT = pdf;
    this.IFRAME_ID = id;
    this.IFRAME_URL = url;
    this.IFRAME_RATE = rate;
    this.IFRAME_MAX_FRAME = maxFrame;
  }
  static SetViewBox(
    x: number,
    y: number,
    width: number,
    height: number,
    rate: number,
  ) {
    Root.setViewBox(x, y, width, height, rate);
  }
  static SetDescription(description: string) {
    Status.setDescription(description);
  }
  static StopAnimate() {
    A.stop();
  }
  static StartAnimate() {
    A.start();
  }
  static Reload() {
    window.location.reload();
  }
  static OnInited() {
    window.parent.postMessage("inited", "*");
  }
  static notifyParent() {
    // Sentinel: no entity contributed during the flush pass. Fall back to the
    // centered default canvas so the host gets something usable instead of an
    // infinite/empty viewBox.
    const hasContent = isFinite(this.MATH_MINX) && isFinite(this.MATH_MAXX);
    const x = hasContent ? this.MATH_MINX : -600;
    const y = hasContent ? this.MATH_MINY : -300;
    const w = hasContent ? this.MATH_MAXX - this.MATH_MINX : 1200;
    const h = hasContent ? this.MATH_MAXY - this.MATH_MINY : 600;
    window.parent.postMessage(
      {
        operator: "SetAnimationSize",
        arguments: [this.IFRAME_ID, this.IFRAME_URL, x, y, w, h],
      },
      "*",
    );
  }
}

D.onKeyDown("nN", nextFrame);
D.onKeyDown("pP", prevFrame);

function lastMainFrame() {
  if (Window.SHOULD_EXPORT) A.forceToFinish();
  if (Window.SHOULD_FLUSH) {
    if (Window.PUPPETEER) return;
    Window.notifyParent(); // set the animation size of parent window
    if (Window.SHOULD_EXPORT) throw new Error("Not implemented yet");
    else throw new Error("Reload (not an error)");
  }
}

function promiseOfFirstInterFrame(): Promise<void> {
  if (Window.IS_CONTINUING) throw new Error();
  if (Window.IS_INTERACTING) throw new Error();
  if (Window.MAXIMUM_FRAME !== Window.CURRENT_FRAME)
    throw new Error("Prevent Execution (Not an Error)");
  Window.IS_INTERACTING = true;
  S.updateFrameStatus();
  return new Promise(function (resolve) {
    const fn = function () {
      if (Window.IS_CONTINUING) return setTimeout(fn, 10); // 主流程的动画不可被打断
      if (!A.finished()) return setTimeout(fn, 10); // 当前 inter frame 过去已经生成，现在触发，需要等待上一帧动画完全结束
      A.startNewFrame();
      resolve();
    };
    fn();
  });
}

function promiseOfLastInterFrame(): Promise<void> {
  Window.IS_INTERACTING = false;
  S.updateFrameStatus();
  return Promise.resolve();
}

function promiseOfNormalFrame(): Promise<void> {
  const currentInteracting = Window.IS_INTERACTING;
  return new Promise(function (resolve) {
    const fn = function () {
      if (Window.SHOULD_FLUSH) {
        A.currentActionList.updateWindowSize();
        return resolve();
      }
      if (Window.IS_CONTINUING) return setTimeout(fn, 10);
      if (Window.IS_INTERACTING && !currentInteracting)
        return setTimeout(fn, 10);
      if (Window.WHOSEJAM === 0) return setTimeout(fn, 10);
      Window.WHOSEJAM--;
      return resolve();
    };
    fn();
  });
}

function promiseOfContinueFrame(): Promise<void> {
  Window.IS_CONTINUING = true;
  S.updateFrameStatus();
  return new Promise(function (resolve) {
    const fn = function () {
      if (Window.SHOULD_FLUSH) {
        A.currentActionList.updateWindowSize();
        return resolve();
      }
      if (Window.WHOSEJAM === 0) return setTimeout(fn, 10);
      Window.IS_CONTINUING = false;
      S.updateFrameStatus();
      Window.WHOSEJAM--;
      return resolve();
    };
    fn();
  });
}

function promiseOfLastMainFrame(): Promise<void> {
  return new Promise(function (resolve) {
    const fn = function () {
      if (Window.SHOULD_FLUSH) {
        A.currentActionList.updateWindowSize();
        lastMainFrame();
        return resolve();
      }
      setTimeout(fn, 10);
    };
    fn();
  });
}

function promiseForMilliseconds(ms: number): Promise<void> {
  Window.ACTION_DELAY += ms;
  return Promise.resolve();
}

/**
 * Pauses execution flow until the user triggers the next stage.
 * Acts as an interactive breakpoint between two animation stage.
 * @param frameType - The type of frame pause. Can be a predefined constant or a positive number representing milliseconds to pause.
 * @returns A promise that resolves when the pause condition is met.
 * @example
 * await sd.pause(); // Wait for user to click 'N'('N' for next) button.
 * // Operations to execute in the next animation stage.
 * await sd.pause(1000); // Wait for 1000 milliseconds (1 second).
 * // Operations to execute in the next animation stage.
 * await sd.pause(); // Wait for another user interaction.
 * // Operations to execute in the next animation stage.
 */
export function pause(ms?: number): Promise<void> {
  const pauseBehavior = ms ?? NORMAL_FRAME;
  if (Window.SHOULD_FLUSH) {
    A.currentActionList.updateWindowSize();
    // limit frame count, to handle the infinite animation
    if (
      Window.CURRENT_FRAME <= Window.IFRAME_MAX_FRAME &&
      pauseBehavior !== LAST_MAIN_STAGE
    ) {
      Window.CURRENT_FRAME++;
      return; // no block
    } else {
      lastMainFrame();
      return;
    }
  }
  A.firstTick();
  A.trigger();
  A.debug();
  if (ms > 0) return promiseForMilliseconds(ms);
  Window.ACTION_DELAY = 0;
  switch (pauseBehavior) {
    case FIRST_INTER_STAGE:
      return promiseOfFirstInterFrame();
    case LAST_INTER_STAGE:
      return promiseOfLastInterFrame();
    case CONTINUE_STAGE:
      return promiseOfContinueFrame();
    case NORMAL_FRAME:
      return promiseOfNormalFrame();
    case LAST_MAIN_STAGE:
      return promiseOfLastMainFrame();
  }
}

function prevFrame() {
  if (Window.CURRENT_FRAME < 0) return;
  if (!A.finished()) A.forceToFinish();
  else A.rollbackFrame();
}

function nextFrame() {
  if (Window.CURRENT_FRAME + 1 > Window.MAXIMUM_FRAME) {
    if (!A.finished()) A.forceToFinish();
    else if (Window.WHOSEJAM === 0) {
      Window.WHOSEJAM++;
      A.startNewFrame();
    }
  } else {
    if (!A.finished()) A.forceToFinish();
    else A.replayFrame();
  }
}
