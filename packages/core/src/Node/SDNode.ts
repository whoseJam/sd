import { Action } from "@/Animate/Action";
import { Animate } from "@/Animate/Animate";
import { Context } from "@/Animate/Context";
import type {
  InterpCreator,
  InterpFunction,
  InterpObject,
  LazyInterpFunction,
} from "@/Animate/Interp";
import { Interp, isInterpCreator } from "@/Animate/Interp";
import type { SDEasingFunction } from "@/Math/EasingFunction";
import { EasingFunction as T } from "@/Math/EasingFunction";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { Group } from "@/Node/Other/Group";
import type { Filter } from "@/Node/Filter/Filter";
import { Window } from "@/Animate/Window";

export type Percent = `${number}%`;
export type NumberOrPercent = number | Percent;
type XLocationString = "left" | "center" | "right";
type YLocationString = "top" | "center" | "bottom";
type XLocation = NumberOrPercent | XLocationString;
type YLocation = NumberOrPercent | YLocationString;
export type TransformOrigin = [XLocation, YLocation];

export type SDBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AttributeListener = (vn: any, vo: any) => void;

// Reactive attribute shape. Each reactive field is stored on `this.attributes`
// (not as a direct instance field) and exposed via getter/setter pairs.
// Subclasses widen this type via `declare attributes: SDNodeAttributes & { ... }`
// so their own reactive fields (cx, cy, r, x, y, d, text, ...) become
// first-class typed keys for triggerAttributeChanged / on*Changed.
export type SDNodeAttributes = {
  opacity: number;
  scale: [number, number];
  rotate: number;
  translate: [number, number];
  transformOrigin: [NumberOrPercent, NumberOrPercent];
};

export abstract class SDNode {
  id: number;
  // Engine state — typed first-class fields, not part of the dynamic _ bag.
  // Public for now because sibling SDNode subclasses (Group, Filter) and
  // free functions (ActionList.visible, text engines) read/write these
  // across instances; tightening visibility is Phase 3 work.
  parent: Group | Filter | undefined = undefined;
  renderer: RenderNode | undefined = undefined;
  foreign?: RenderNode;
  frame: number = -1;
  // delayMs / durationMs collide with the delay() / duration() methods if
  // named the same; the methods stay because they're the public API.
  delayMs: number = 0;
  durationMs: number = 0;
  subAnimates: Array<Context> = [];
  timingFunction: SDEasingFunction | undefined = undefined;
  ready: boolean = false;
  attributes: SDNodeAttributes = {
    opacity: 1,
    scale: [1, 1],
    rotate: 0,
    translate: [0, 0],
    transformOrigin: ["50%", "50%"],
  };
  private listeners: { [key: string]: Array<AttributeListener> };
  static NODE_ID = 0;
  constructor() {
    this.id = ++SDNode.NODE_ID;
    this.listeners = {};
  }

  getRootRenderNode(): RenderNode {
    if (this.foreign) return this.foreign;
    return this.renderer;
  }

  startSubAnimate() {
    const context = new Context(this);
    this.subAnimates.push(context);
    return this;
  }

  subAnimate(l: number, r: number) {
    const context = this.subAnimates[this.subAnimates.length - 1];
    context.till(l, r);
    return this;
  }
  endSubAnimate() {
    const context = this.subAnimates.pop();
    context.recover();
    return this;
  }

  startAnimate(args?: {
    delay?: number;
    duration?: number;
    easing?: SDEasingFunction;
  }) {
    this.delayMs = args?.delay ?? 0;
    this.durationMs = args?.duration ?? 300;
    this.timingFunction = T.toEasingFunction(args?.easing);
    return this;
  }

  /**
   * Finalizes and applies the current animation sequence.
   * - Call this method after configuring properties with `startAnimate()` to finish the animation.
   * @returns The current component instance for method chaining.
   */
  endAnimate(): this {
    this.delayMs = 0;
    this.durationMs = 0;
    this.timingFunction = undefined;
    return this;
  }

  /**
   * Gets the delay of current animation sequence.
   * This method returns the time offset from the animation's start time.
   * @returns The delay duration in milliseconds.
   */
  delay() {
    return this.delayMs;
  }

  /**
   * Gets the duration of current animation sequence.
   */
  duration() {
    return this.durationMs;
  }

  /**
   * Removes this component from the scene.
   * @returns The current component instance for method chaining.
   */
  remove() {
    this.getRootRenderNode().remove();
  }

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    renderer.setAttribute(key, value);
  }

  get opacity(): number {
    return this.attributes.opacity;
  }

  set opacity(v: number) {
    this.triggerAttributeChanged(
      this.getRootRenderNode(),
      "opacity",
      v,
      this.attributes.opacity,
      Interp.numberInterp,
    );
  }

  getOpacity(): number {
    return this.opacity;
  }

  setOpacity(opacity: number): this {
    this.opacity = opacity;
    return this;
  }

  onOpacityChanged(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("opacity", listener);
  }

  offOpacityChanged(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("opacity", listener);
  }

  abstract getX(): number;
  abstract getY(): number;
  abstract getWidth(): number;
  abstract getHeight(): number;

  get scale(): [number, number] {
    return this.attributes.scale;
  }

  set scale(v: [number, number]) {
    this.triggerAttributeChanged(
      this.getRootRenderNode(),
      "scale",
      v,
      this.attributes.scale,
      Interp.arrayInterp,
    );
  }

  setScale(scale: number): this;
  setScale(sx: number, sy: number): this;
  setScale(s: [number, number]): this;
  setScale(sx: number | [number, number], sy?: number): this {
    if (Array.isArray(sx)) return this.setScale(sx[0], sx[1]);
    if (sy === undefined) return this.setScale(sx, sx);
    this.scale = [sx, sy];
    return this;
  }

  getScale(): [number, number] {
    return this.scale;
  }

  onScaleChanged(
    listener: (vn: [number, number], vo: [number, number]) => void,
  ): this {
    return this.onAttributeChanged("scale", listener);
  }

  offScaleChanged(
    listener: (vn: [number, number], vo: [number, number]) => void,
  ): this {
    return this.offAttributeChanged("scale", listener);
  }

  get rotate(): number {
    return this.attributes.rotate;
  }

  set rotate(v: number) {
    this.triggerAttributeChanged(
      this.getRootRenderNode(),
      "rotate",
      v,
      this.attributes.rotate,
      Interp.numberInterp,
    );
  }

  setRotate(rotate: number): this {
    this.rotate = rotate;
    return this;
  }

  setRotation(rotation: number): this {
    return this.setRotate(rotation);
  }

  onRotateChanged(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("rotate", listener);
  }

  offRotateChanged(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("rotate", listener);
  }

  get translate(): [number, number] {
    return this.attributes.translate;
  }

  set translate(v: [number, number]) {
    this.triggerAttributeChanged(
      this.getRootRenderNode(),
      "translate",
      v,
      this.attributes.translate,
      Interp.arrayInterp,
    );
  }

  setTranslate(dx: number, dy: number): this;
  setTranslate(d: [number, number]): this;
  setTranslate(dx: number | [number, number], dy?: number): this {
    if (Array.isArray(dx)) return this.setTranslate(dx[0], dx[1]);
    this.translate = [dx, dy];
    return this;
  }

  onTranslateChanged(
    listener: (vn: [number, number], vo: [number, number]) => void,
  ) {
    return this.onAttributeChanged("translate", listener);
  }

  offTranslateChanged(
    listener: (vn: [number, number], vo: [number, number]) => void,
  ) {
    return this.offAttributeChanged("translate", listener);
  }

  get transformOrigin(): [NumberOrPercent, NumberOrPercent] {
    return this.attributes.transformOrigin;
  }

  set transformOrigin(v: [NumberOrPercent, NumberOrPercent]) {
    this.triggerAttributeChanged(
      this.getRootRenderNode(),
      "transformOrigin",
      v,
      this.attributes.transformOrigin,
    );
  }

  setTransformOrigin(x: XLocation, y: YLocation): this;
  setTransformOrigin(origin: [XLocation, YLocation]): this;
  setTransformOrigin(x: XLocation | [XLocation, YLocation], y?: YLocation) {
    if (Array.isArray(x)) return this.setTransformOrigin(x[0], x[1]);
    this.transformOrigin = [x, y] as [NumberOrPercent, NumberOrPercent];
    return this;
  }

  getTransformOrigin(): [NumberOrPercent, NumberOrPercent] {
    return this.transformOrigin;
  }

  onTransformOriginChanged(
    listener: (
      vn: [NumberOrPercent, NumberOrPercent],
      vo: [NumberOrPercent, NumberOrPercent],
    ) => void,
  ) {
    return this.onAttributeChanged("transformOrigin", listener);
  }

  offTransformOriginChanged(
    listener: (
      vn: [NumberOrPercent, NumberOrPercent],
      vo: [NumberOrPercent, NumberOrPercent],
    ) => void,
  ) {
    return this.offAttributeChanged("transformOrigin", listener);
  }

  getCenter(): [number, number] {
    return [this.getCenterX(), this.getCenterY()];
  }

  getCenterX(): number {
    return this.getX() + this.getWidth() / 2;
  }

  getCx(): number {
    return this.getCenterX();
  }

  getCenterY(): number {
    return this.getY() + this.getHeight() / 2;
  }

  getCy(): number {
    return this.getCenterY();
  }

  getMaxX() {
    return this.getX() + this.getWidth();
  }

  getMaxY() {
    return this.getY() + this.getHeight();
  }

  /**
   * Makes this component appear.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a component appear.
   * node.startAnimate().appear().endAnimate();
   */
  appear() {
    return this.startSubAnimate() // opacity from 0 to 1
      .subAnimate(0, 0)
      .setOpacity(0)
      .subAnimate(0, 1)
      .setOpacity(1)
      .endSubAnimate();
  }

  /**
   * Makes this component disappear.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a component disappear.
   * node.startAnimate().disappear().endAnimate();
   */
  disappear() {
    return this.startSubAnimate() // opacity from 1 to 0
      .subAnimate(0, 0)
      .setOpacity(1)
      .subAnimate(0, 1)
      .setOpacity(0)
      .endSubAnimate();
  }

  /**
   * Makes this component zoom in from scale 0 to 1.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a component zoom in.
   * node.startAnimate().zoomIn().endAnimate();
   */
  zoomIn() {
    return this.startSubAnimate() // scale from 0 to 1
      .subAnimate(0, 0)
      .setTransformOrigin(this.getCenter())
      .setScale(0)
      .subAnimate(0, 1)
      .setScale(1)
      .endSubAnimate();
  }

  /**
   * Makes this component zoom out from scale 1 to 0.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a component zoom out.
   * node.startAnimate().zoomOut().endAnimate();
   */
  zoomOut() {
    return this.startSubAnimate() // scale from 1 to 0
      .subAnimate(0, 0)
      .setTransformOrigin(this.getCenter())
      .setScale(1)
      .subAnimate(0, 1)
      .setScale(0)
      .endSubAnimate();
  }

  /**
   * Makes this component fade in by gradually increasing opacity from 0 to 1.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a component fade in.
   * node.startAnimate().fadeIn().endAnimate();
   */
  fadeIn() {
    return this.appear();
  }

  /**
   * Makes this component fade out by gradually decreasing opacity from 1 to 0.
   *
   * This component must be animated currently.
   * @returns The current component instance for method chaining.
   * @example
   * // Makes a component fade out.
   * node.startAnimate().fadeOut().endAnimate();
   */
  fadeOut() {
    return this.disappear();
  }

  protected onAttributeChanged(key: string, listener: AttributeListener) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(listener);
    return this;
  }

  protected offAttributeChanged(key: string, listener: AttributeListener) {
    const index = this.listeners[key].indexOf(listener);
    if (index !== -1) this.listeners[key].splice(index, 1);
    return this;
  }

  protected triggerAttributeChanged<
    K extends keyof this["attributes"] & string,
  >(
    object: RenderNode | undefined,
    key: K,
    vn: this["attributes"][K],
    vo: this["attributes"][K],
    interp?: InterpObject | InterpFunction | LazyInterpFunction | InterpCreator,
  ): this {
    (this.attributes as this["attributes"])[key] = vn;
    // No render target = no animation. Happens during construction when a
    // setter runs before createSVGNode has assigned this.renderer. Just
    // update the model and fire listeners — there's nothing to paint.
    if (interp && Window.SHOULD_INTERP && object) {
      const interp_ = isInterpCreator(interp) ? interp(object, key) : interp;
      Animate.push(
        new Action(
          this.delay(),
          this.delay() + this.duration(),
          vo,
          vn,
          interp_,
          this.timingFunction,
          this,
          key,
        ),
      );
    } else if (object) this.renderAttribute(object, key, vn);
    this.listeners[key]?.forEach((listener) => listener(vn, vo));
    return this;
  }

  // static __asNode(target: SDNode | RenderNode, object: any, id?: string): SDNode {
  //     if (object === null || object === undefined) {
  //         const { Text } = require("@/Node/Text/Text");
  //         if (id !== undefined) return new Text(target, id).opacity(0);
  //         return null;
  //     }
  //     if (typeof object === "function") return object(target).opacity(0);
  //     if (typeof object === "number" || typeof object === "string") {
  //         const { Text } = require("@/Node/Text/Text");
  //         const { Math } = require("@/Node/Text/Math");
  //         if (String(object).startsWith("$")) return new Math(target, id).opacity(0);
  //         return new Text(target, object).opacity(0);
  //     }
  //     return object;
  // }
}

type AnyFunction = (...args: any[]) => any;
export type SDNodeWithColor = SDNode & { color: AnyFunction };
export type SDNodeWithDrop = SDNode & { drop: AnyFunction };
export type SDNodeWithIntValue = SDNode & { intValue: AnyFunction };
export type SDNodeWithText = SDNode & { text: AnyFunction };
export type SDNodeWithValue = SDNode & { value: AnyFunction };
export type SDNodeWithValueFromExist = SDNode & { valueFromExist: AnyFunction };
export type SDNodeWithRadius = SDNode & { r: AnyFunction };

function isPercent(value: any): value is Percent {
  return typeof value === "string" && value.endsWith("%");
}
