import type { RenderNode } from "@/renderer/render-node";

import { Window } from "@/animate/window";
import { SDNode } from "@/node/node";

export type TweenFn = (t: number) => Record<string, number>;
export type TweenBounds = { x?: [number, number]; y?: [number, number] };

export class ParametricAction {
  static stopFlag = 1 << 0;
  static hideFlag = 1 << 1;
  static firstCallFlag = 1 << 2;

  l: number;
  r: number;
  t: number;
  frame: number;
  entity: SDNode;
  renderer: RenderNode;
  attrs: string[];
  fn: TweenFn;
  timingFunction: (t: number) => number;
  bounds?: TweenBounds;
  flag: number;
  next: ParametricAction;
  prev: ParametricAction;

  constructor(
    l: number,
    r: number,
    entity: SDNode,
    renderer: RenderNode,
    attrs: string[],
    fn: TweenFn,
    timingFunction: (t: number) => number,
    bounds?: TweenBounds,
  ) {
    this.t = 0;
    this.l = l + Window.ACTION_DELAY;
    this.r = r + Window.ACTION_DELAY;
    this.entity = entity;
    this.renderer = renderer;
    this.attrs = attrs;
    this.fn = fn;
    this.timingFunction = timingFunction;
    this.bounds = bounds;
    this.frame = Window.CURRENT_FRAME;
    this.flag = ParametricAction.firstCallFlag;
    this.next = undefined;
    this.prev = undefined;
  }

  tick(t: number) {
    if (t < this.l) return false;
    Window.ACTION_TICK++;
    const span = this.r - this.l;
    const k0 = span > 0 ? this.timingFunction((t - this.l) / span) : 1;
    const k1 = this.is(ParametricAction.firstCallFlag) ? 0 : t > this.r ? 1 : k0;
    this.apply(k1);
    if (k1 === 1) this.set(ParametricAction.stopFlag);
    this.unset(ParametricAction.firstCallFlag);
    Window.ACTION_TICK--;
    return true;
  }

  apply(k: number) {
    const values = this.fn(k);
    for (const key of this.attrs) {
      const v = values[key];
      if (v === undefined) continue;
      this.entity.renderAttribute(this.renderer, key, v);
    }
  }

  forceToFinish() {
    this.tick(this.r + 5);
    if (!this.is(ParametricAction.stopFlag)) this.tick(this.r + 5);
  }

  is(flag: number) {
    return (this.flag & flag) !== 0;
  }
  set(flag: number) {
    this.flag |= flag;
  }
  unset(flag: number) {
    this.flag &= ~flag;
  }

  toString() {
    return `[${this.l}, ${this.r}] tween attrs=${this.attrs.join(",")} nodeId=${this.entity.nodeId} frame=${this.frame}`;
  }
}
