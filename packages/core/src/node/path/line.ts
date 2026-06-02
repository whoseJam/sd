import type { SDFilter } from "@/node/filter/filter";
import type { Group } from "@/node/other/group";
import type { StrokeLineCap, StrokeLineJoin } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";
import type { SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { Vector as V } from "@/math/vector";
import { Filter } from "@/node/filter/filter";
import { BasePath } from "@/node/path/base-path";
import { SDSVGNode } from "@/node/svg-node";
import { Color as C } from "@/utility/color";

import type { TransformOrigin } from "../node";
import type { BasePathAttributes } from "@/node/path/base-path";

export type LineAttributes = BasePathAttributes & {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export class Line extends BasePath {
  declare attributes: LineAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "y1" || key === "y2") return renderer.setAttribute(key, -value);
    super.renderAttribute(renderer, key, value);
  }

  constructor(args?: {
    targetNode?: Group;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    transformOrigin?: TransformOrigin;
    translate?: [number, number];
    rotate?: number;
    scale?: [number, number];
    opacity?: number;
    fill?: SDColor;
    fillOpacity?: number;
    stroke?: SDColor;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDashOffset?: number;
    strokeDashoffset?: number;
    strokeDashArray?: string | number | Array<number>;
    strokeDasharray?: string | number | Array<number>;
    strokeLineCap?: StrokeLineCap;
    strokeLineJoin?: StrokeLineJoin;
    filter?: SDFilter;
  }) {
    super();

    this.attributes = {
      ...this.attributes,
      transformOrigin: args?.transformOrigin ?? ["center", "center"],
      translate: args?.translate ?? [0, 0],
      rotate: args?.rotate ?? 0,
      scale: args?.scale ?? [1, 1],
      opacity: args?.opacity ?? 1,
      fill: C.toRGBA(C.toFill(args?.fill ?? C.none)),
      stroke: C.toRGBA(C.toStroke(args?.stroke ?? C.black)),
      fillOpacity: args?.fillOpacity ?? 0,
      strokeOpacity: args?.strokeOpacity ?? 1,
      strokeWidth: args?.strokeWidth ?? 1,
      strokeDashOffset: args?.strokeDashOffset ?? args?.strokeDashoffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(
        args?.strokeDashArray ?? args?.strokeDasharray,
      ),
      strokeLineCap: args?.strokeLineCap ?? "butt",
      strokeLineJoin: args?.strokeLineJoin ?? "miter",
      x1: args?.x1 ?? 0,
      y1: args?.y1 ?? 0,
      x2: args?.x2 ?? 40,
      y2: args?.y2 ?? 40,
    };

    this.createSVGNode("line", {
      filter: Filter.toURLString(args?.filter),
    });

    args?.targetNode?.appendChild(this);
  }

  getX() {
    return Math.min(this.getX1(), this.getX2());
  }

  getY() {
    return Math.min(this.getY1(), this.getY2());
  }

  getMaxX() {
    return Math.max(this.getX1(), this.getX2());
  }

  getMaxY() {
    return Math.max(this.getY1(), this.getY2());
  }

  getWidth() {
    return this.getMaxX() - this.getX();
  }

  getHeight() {
    return this.getMaxY() - this.getY();
  }

  get x1(): number {
    return this.attributes.x1;
  }

  set x1(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "x1",
      v,
      this.attributes.x1,
      Interp.numberInterp,
    );
  }

  getX1(): number {
    return this.x1;
  }

  setX1(x1: number): this {
    this.x1 = x1;
    return this;
  }

  onX1Changed(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("x1", listener);
  }

  offX1Changed(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("x1", listener);
  }

  get x2(): number {
    return this.attributes.x2;
  }

  set x2(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "x2",
      v,
      this.attributes.x2,
      Interp.numberInterp,
    );
  }

  getX2(): number {
    return this.x2;
  }

  setX2(x2: number): this {
    this.x2 = x2;
    return this;
  }

  onX2Changed(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("x2", listener);
  }

  offX2Changed(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("x2", listener);
  }

  get y1(): number {
    return this.attributes.y1;
  }

  set y1(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "y1",
      v,
      this.attributes.y1,
      Interp.numberInterp,
    );
  }

  getY1(): number {
    return this.y1;
  }

  setY1(y1: number): this {
    this.y1 = y1;
    return this;
  }

  onY1Changed(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("y1", listener);
  }

  offY1Changed(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("y1", listener);
  }

  get y2(): number {
    return this.attributes.y2;
  }

  set y2(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "y2",
      v,
      this.attributes.y2,
      Interp.numberInterp,
    );
  }

  getY2(): number {
    return this.y2;
  }

  setY2(y2: number): this {
    this.y2 = y2;
    return this;
  }

  onY2Changed(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("y2", listener);
  }

  offY2Changed(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("y2", listener);
  }

  getSourcePoint(): [number, number] {
    return [this.getX1(), this.getY1()];
  }

  setSourcePoint(p: [number, number]): this;
  setSourcePoint(x: number, y: number): this;
  setSourcePoint(x: number | [number, number], y?: number) {
    if (Array.isArray(x)) return this.setSourcePoint(x[0], x[1]);
    return this.setX1(x).setY1(y);
  }

  getTargetPoint(): [number, number] {
    return [this.getX2(), this.getY2()];
  }

  setTargetPoint(p: [number, number]): this;
  setTargetPoint(x: number, y: number): this;
  setTargetPoint(x: number | [number, number], y?: number) {
    if (Array.isArray(x)) return this.setTargetPoint(x[0], x[1]);
    return this.setX2(x).setY2(y);
  }

  getPointAtRate(k: number) {
    const v1 = this.getSourcePoint();
    const v2 = this.getTargetPoint();
    const d = V.sub(v2, v1);
    return V.add(v1, V.numberMul(d, k));
  }

  getPointAtLength(length: number) {
    const total = this.totalLength();
    const k = length / total;
    return this.getPointAtRate(k);
  }

  totalLength() {
    const v1 = this.getSourcePoint();
    const v2 = this.getTargetPoint();
    return V.norm(V.sub(v1, v2));
  }
}
