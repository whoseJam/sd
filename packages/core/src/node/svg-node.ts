import type { SDNodeAttributes } from "@/node/node";
import type { SDAllColor, SDHEXColor, SDRGBAColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { SDNode } from "@/node/node";
import { RenderNode } from "@/renderer/render-node";
import { Color as C } from "@/utility/color";

export type StrokeLineCap = "butt" | "round" | "square";
export type StrokeLineJoin = "miter" | "round" | "bevel";

export type SDSVGNodeAttributes = SDNodeAttributes & {
  fill: SDRGBAColor;
  stroke: SDRGBAColor;
  fillOpacity: number;
  strokeOpacity: number;
  strokeWidth: number;
  strokeDashOffset: number;
  strokeDashArray: Array<number>;
  strokeLineCap: StrokeLineCap;
  strokeLineJoin: StrokeLineJoin;
};

export abstract class SDSVGNode extends SDNode {
  declare attributes: SDSVGNodeAttributes;

  constructor(parent?: SDNode | RenderNode) {
    super(parent);
    this.attributes = {
      ...this.attributes,
      fill: C.toRGBA(C.black),
      stroke: C.toRGBA(C.none),
      fillOpacity: 1,
      strokeOpacity: 1,
      strokeWidth: 1,
      strokeDashOffset: 0,
      strokeDashArray: [],
      strokeLineCap: "butt",
      strokeLineJoin: "miter",
    };
  }

  get fill(): SDRGBAColor {
    return this.attributes.fill;
  }

  set fill(v: SDRGBAColor) {
    this.triggerAttributeChanged(
      this.renderer,
      "fill",
      v,
      this.attributes.fill,
      Interp.colorInterp,
    );
  }

  getFill(): SDHEXColor {
    return C.toHEX(this.attributes.fill);
  }

  setFill(fill: SDAllColor): this {
    this.fill = C.toRGBA(C.toFill(fill));
    return this;
  }

  onFillChanged(listener: (vn: SDRGBAColor, vo: SDRGBAColor) => void) {
    return this.onAttributeChanged("fill", listener);
  }

  offFillChanged(listener: (vn: SDRGBAColor, vo: SDRGBAColor) => void) {
    return this.offAttributeChanged("fill", listener);
  }

  get stroke(): SDRGBAColor {
    return this.attributes.stroke;
  }

  set stroke(v: SDRGBAColor) {
    this.triggerAttributeChanged(
      this.renderer,
      "stroke",
      v,
      this.attributes.stroke,
      Interp.colorInterp,
    );
  }

  getStroke(): SDHEXColor {
    return C.toHEX(this.attributes.stroke);
  }

  setStroke(stroke: SDAllColor): this {
    this.stroke = C.toRGBA(C.toStroke(stroke));
    return this;
  }

  onStrokeChanged(listener: (vn: SDRGBAColor, vo: SDRGBAColor) => void) {
    return this.onAttributeChanged("stroke", listener);
  }

  offStrokeChanged(listener: (vn: SDRGBAColor, vo: SDRGBAColor) => void) {
    return this.offAttributeChanged("stroke", listener);
  }

  get fillOpacity(): number {
    return this.attributes.fillOpacity;
  }

  set fillOpacity(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "fillOpacity",
      v,
      this.attributes.fillOpacity,
      Interp.numberInterp,
    );
  }

  getFillOpacity(): number {
    return this.fillOpacity;
  }

  setFillOpacity(opacity: number): this {
    this.fillOpacity = opacity;
    return this;
  }

  onFillOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("fillOpacity", listener);
  }

  offFillOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("fillOpacity", listener);
  }

  get strokeOpacity(): number {
    return this.attributes.strokeOpacity;
  }

  set strokeOpacity(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "strokeOpacity",
      v,
      this.attributes.strokeOpacity,
      Interp.numberInterp,
    );
  }

  getStrokeOpacity(): number {
    return this.strokeOpacity;
  }

  setStrokeOpacity(opacity: number): this {
    this.strokeOpacity = opacity;
    return this;
  }

  onStrokeOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("strokeOpacity", listener);
  }

  offStrokeOpacityChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("strokeOpacity", listener);
  }

  get strokeWidth(): number {
    return this.attributes.strokeWidth;
  }

  set strokeWidth(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "strokeWidth",
      v,
      this.attributes.strokeWidth,
      Interp.numberInterp,
    );
  }

  getStrokeWidth(): number {
    return this.strokeWidth;
  }

  setStrokeWidth(width: number): this {
    this.strokeWidth = width;
    return this;
  }

  onStrokeWidthChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("strokeWidth", listener);
  }

  offStrokeWidthChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("strokeWidth", listener);
  }

  get strokeDashOffset(): number {
    return this.attributes.strokeDashOffset;
  }

  set strokeDashOffset(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "strokeDashOffset",
      v,
      this.attributes.strokeDashOffset,
      Interp.numberInterp,
    );
  }

  getStrokeDashOffset(): number {
    return this.strokeDashOffset;
  }

  setStrokeDashOffset(offset: number): this {
    this.strokeDashOffset = offset;
    return this;
  }

  onStrokeDashOffsetChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("strokeDashOffset", listener);
  }

  offStrokeDashOffsetChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("strokeDashOffset", listener);
  }

  get strokeDashArray(): Array<number> {
    return this.attributes.strokeDashArray;
  }

  set strokeDashArray(v: Array<number>) {
    this.triggerAttributeChanged(
      this.renderer,
      "strokeDashArray",
      v,
      this.attributes.strokeDashArray,
      Interp.arrayInterp,
    );
  }

  getStrokeDashArray(): Array<number> {
    return this.strokeDashArray;
  }

  setStrokeDashArray(array: string | number | Array<number>): this {
    this.strokeDashArray = SDSVGNode.toStrokeDashArray(array);
    return this;
  }

  onStrokeDashArrayChanged(
    listener: (vn: Array<number>, vo: Array<number>) => void,
  ) {
    return this.onAttributeChanged("strokeDashArray", listener);
  }

  offStrokeDashArrayChanged(
    listener: (vn: Array<number>, vo: Array<number>) => void,
  ) {
    return this.offAttributeChanged("strokeDashArray", listener);
  }

  get strokeLineCap(): StrokeLineCap {
    return this.attributes.strokeLineCap;
  }

  set strokeLineCap(v: StrokeLineCap) {
    this.triggerAttributeChanged(
      this.renderer,
      "strokeLineCap",
      v,
      this.attributes.strokeLineCap,
      Interp.stringInterp,
    );
  }

  getStrokeLineCap(): StrokeLineCap {
    return this.strokeLineCap;
  }

  setStrokeLineCap(lineCap: StrokeLineCap): this {
    this.strokeLineCap = lineCap;
    return this;
  }

  onStrokeLineCapChanged(
    listener: (vn: StrokeLineCap, vo: StrokeLineCap) => void,
  ) {
    return this.onAttributeChanged("strokeLineCap", listener);
  }

  offStrokeLineCapChanged(
    listener: (vn: StrokeLineCap, vo: StrokeLineCap) => void,
  ) {
    return this.offAttributeChanged("strokeLineCap", listener);
  }

  get strokeLineJoin(): StrokeLineJoin {
    return this.attributes.strokeLineJoin;
  }

  set strokeLineJoin(v: StrokeLineJoin) {
    this.triggerAttributeChanged(
      this.renderer,
      "strokeLineJoin",
      v,
      this.attributes.strokeLineJoin,
      Interp.stringInterp,
    );
  }

  getStrokeLineJoin(): StrokeLineJoin {
    return this.strokeLineJoin;
  }

  setStrokeLineJoin(lineJoin: StrokeLineJoin): this {
    this.strokeLineJoin = lineJoin;
    return this;
  }

  onStrokeLineJoinChanged(
    listener: (vn: StrokeLineJoin, vo: StrokeLineJoin) => void,
  ) {
    return this.onAttributeChanged("strokeLineJoin", listener);
  }

  offStrokeLineJoinChanged(
    listener: (vn: StrokeLineJoin, vo: StrokeLineJoin) => void,
  ) {
    return this.offAttributeChanged("strokeLineJoin", listener);
  }

  // Paints initial DOM. Reactive attributes (already populated by the
  // subclass constructor on this.attributes) go first; then any DOM-only
  // extras the subclass needs to paint ("text-anchor", "preserveAspectRatio",
  // filter url, etc.). Crucially, this does NOT write the model — it never
  // touches `this` outside of `this.renderer`. Subclass constructors are
  // fully responsible for populating this.attributes before calling this.
  protected createSVGNode(
    label: string,
    extras: Record<string, unknown> = {},
  ): RenderNode {
    const object = RenderNode.createRenderNode(this, undefined, label);
    this.renderer = object;
    const attrs = this.attributes as this["attributes"];
    for (const key of Object.keys(attrs) as Array<
      keyof this["attributes"] & string
    >) {
      this.renderAttribute(object, key, attrs[key]);
    }
    for (const key in extras) this.renderAttribute(object, key, extras[key]);
    return object;
  }

  protected static toStrokeDashArray(
    strokeDashArray: string | number | Array<number>,
  ): Array<number> {
    if (strokeDashArray === undefined) return [];
    if (typeof strokeDashArray === "number") return [strokeDashArray];
    if (typeof strokeDashArray === "string")
      return strokeDashArray.split(/[\s,]+/).map((value) => +value);
    return strokeDashArray;
  }
}
