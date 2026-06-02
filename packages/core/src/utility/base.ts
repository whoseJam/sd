import { Animate as A } from "@/animate/animate";
import {
  FIRST_INTER_STAGE,
  LAST_INTER_STAGE,
  LAST_MAIN_STAGE,
  pause,
  Window,
} from "@/animate/window";
import { FontManager } from "@/node/text/text-engine/opentype";

let initFinished: boolean = true;

/**
 * Initializes the framework environment.
 *
 * This method must be called before invoking `sd.main()`. It prepares the framework runtime
 * and provides an optional callback for custom initialization logic.
 *
 * @param callback - Optional callback to execute custom initialization tasks.
 *                   This can be used to set up application-specific configurations
 *                   or perform asynchronous operations before the main application starts.
 *                   If no custom logic is needed, this parameter can be omitted.
 */
export async function init(
  callback: (args?: Record<string, any>) => void | Promise<void>,
): Promise<void> {
  initFinished = false;
  const fn = async (): Promise<void> => {
    if (
      window.self === window.top ||
      (window.self !== window.top && Window.IFRAME_INITED)
    ) {
      await callback(Window.IFRAME_ARGS ?? {});
      initFinished = true;
    } else {
      setTimeout(fn, 20);
    }
  };
  setTimeout(fn, 20);
}

/**
 * Starts the main animation process of the framework.
 *
 * This method must be called after `sd.init()` to begin the main animation process.
 * It processes all animation stages and handles segmentation via `sd.pause()` calls.
 *
 * @param callback - The main animation logic to execute.
 *                   Place all code that depends on the animation lifecycle here.
 *                   Use `sd.pause()` within this callback to segment the animation into stages.
 */
export async function main(
  callback: () => void | Promise<void>,
): Promise<void> {
  A.forceToFinish();
  const fn = async (): Promise<void> => {
    if (initFinished) {
      await FontManager.loadAll();
      await callback();
      await pause(LAST_MAIN_STAGE);
    } else {
      setTimeout(fn, 20);
    }
  };
  setTimeout(fn, 20);
}

export async function loopUpdate(
  callback: (t: number) => void | Promise<void>,
): Promise<void> {
  A.forceToFinish();
  const wrapper = (dt: number) => {
    Window.SHOULD_INTERP = false;
    callback(dt);
    Window.SHOULD_INTERP = true;
    requestAnimationFrame(wrapper);
  };
  requestAnimationFrame(wrapper);
}

/**
 * Inserts an extra animation process into the main animation process.
 *
 * Use this method to create dynamic animations triggered by user interactions
 * (e.g., button clicks, input changes). The provided callback will be
 * executed immediately.
 *
 * @param callback - The extra animation logic to execute.
 */
export async function inter(
  callback: () => void | Promise<void>,
): Promise<void> {
  await pause(FIRST_INTER_STAGE);
  await callback();
  await pause(LAST_INTER_STAGE);
}

/**
 * Creates a one-dimensional array with the specified length and default value.
 *
 * @param length - The length of the array to create.
 * @param defaultValue - The default value for each element. If it's an object, a shallow copy will be created for each element.
 * @returns A new array with the specified length and default values.
 */
export function make1d(length: number): Array<any>;
export function make1d(length: number, defaultValue: any): Array<any>;
export function make1d(length: number, defaultValue: any = 0): Array<any> {
  const result: any[] = [];
  for (let i = 0; i < length; i++) {
    if (typeof defaultValue === "object")
      result.push(Object.assign({}, defaultValue));
    else result.push(defaultValue);
  }
  return result;
}

/**
 * Creates a two-dimensional array (matrix) with the specified dimensions and default value.
 *
 * @param rows - The number of rows in the matrix.
 * @param columns - The number of columns in the matrix.
 * @param defaultValue - The default value for each element.
 * @returns A new 2D array with the specified dimensions and default values.
 */
export function make2d(rows: number, columns: number): Array<Array<any>>;
export function make2d(
  rows: number,
  columns: number,
  defaultValue: any,
): Array<any>;
export function make2d(
  rows: number,
  columns: number,
  defaultValue: any = 0,
): Array<any> {
  const result: any[] = [];
  for (let i = 0; i < rows; i++) result.push(make1d(columns, defaultValue));
  return result;
}

/**
 * Marks the current action as reversible by incrementing the global ACTION_TICK.
 * This allows the action to be undone in the animation system.
 */
export function reversible(): void {
  Window.ACTION_TICK++;
}

/**
 * Marks the current action as irreversible by decrementing the global ACTION_TICK.
 * This prevents the action from being undone in the animation system.
 */
export function irreversible(): void {
  Window.ACTION_TICK--;
}

export function getOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "Windows";
  else if (userAgent.includes("mac")) return "macOS";
  else if (userAgent.includes("linux")) return "Linux";
  else return "未知系统";
}
