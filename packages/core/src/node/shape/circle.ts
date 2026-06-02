import type { AABB } from "@/math/aabb";
import type { SDFilter } from "@/node/filter/filter";
import type { TransformOrigin } from "@/node/node";
import type { Group } from "@/node/other/group";
import type { SDSVGNodeAttributes } from "@/node/svg-node";
import type { StrokeLineCap, StrokeLineJoin } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";
import type { SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { Filter } from "@/node/filter/filter";
import { BaseShape } from "@/node/shape/base-shape";
import { SDSVGNode } from "@/node/svg-node";
import { Color as C } from "@/utility/color";

export type CircleAttributes = SDSVGNodeAttributes & {
  cx: number;
  cy: number;
  r: number;
};

export class Circle extends BaseShape {
  declare attributes: CircleAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "cy") return renderer.setAttribute("cy", -value);
    super.renderAttribute(renderer, key, value);
  }

  constructor(args?: {
    targetNode?: Group;
    cx?: number;
    cy?: number;
    centerX?: number;
    centerY?: number;
    r?: number;
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
      fill: C.toRGBA(C.toFill(args?.fill ?? C.black)),
      stroke: C.toRGBA(C.toStroke(args?.stroke ?? C.none)),
      fillOpacity: args?.fillOpacity ?? 1,
      strokeOpacity: args?.strokeOpacity ?? 1,
      strokeWidth: args?.strokeWidth ?? 1,
      strokeDashOffset: args?.strokeDashOffset ?? args?.strokeDashoffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(
        args?.strokeDashArray ?? args?.strokeDasharray,
      ),
      strokeLineCap: args?.strokeLineCap ?? "butt",
      strokeLineJoin: args?.strokeLineJoin ?? "miter",
      cx: args?.cx ?? args?.centerX ?? 0,
      cy: args?.cy ?? args?.centerY ?? 0,
      r: args?.r ?? 20,
    };

    this.renderer = this.createSVGNode("circle", {
      filter: Filter.toURLString(args?.filter),
    });

    args?.targetNode?.appendChild(this);
  }

  getLocalBox(): AABB {
    const { cx, cy, r } = this.attributes;
    return { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r };
  }

  protected containsLocalPoint(p: [number, number]): boolean {
    const { cx, cy, r } = this.attributes;
    if (r === 0) return false;
    const dx = p[0] - cx;
    const dy = p[1] - cy;
    return dx * dx + dy * dy <= r * r;
  }

  setX(x: number): this {
    return this.setCx(x + this.attributes.r);
  }

  setY(y: number): this {
    return this.setCy(y + this.attributes.r);
  }

  setWidth(width: number): this {
    return this.setR(width / 2);
  }

  setHeight(height: number): this {
    return this.setR(height / 2);
  }

  get cx(): number {
    return this.attributes.cx;
  }

  set cx(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "cx",
      v,
      this.attributes.cx,
      Interp.numberInterp,
    );
  }

  getCx(): number {
    return this.cx;
  }

  setCx(cx: number): this {
    this.cx = cx;
    return this;
  }

  onCxChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("cx", listener);
  }

  offCxChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("cx", listener);
  }

  onCenterXChanged(listener: (vn: number, vo: number) => void) {
    return this.onCxChanged(listener);
  }

  offCenterXChanged(listener: (vn: number, vo: number) => void) {
    return this.offCxChanged(listener);
  }

  get cy(): number {
    return this.attributes.cy;
  }

  set cy(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "cy",
      v,
      this.attributes.cy,
      Interp.numberInterp,
    );
  }

  getCy(): number {
    return this.cy;
  }

  setCy(cy: number): this {
    this.cy = cy;
    return this;
  }

  onCyChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("cy", listener);
  }

  offCyChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("cy", listener);
  }

  onCenterYChanged(listener: (vn: number, vo: number) => void) {
    return this.onCyChanged(listener);
  }

  offCenterYChanged(listener: (vn: number, vo: number) => void) {
    return this.offCyChanged(listener);
  }

  get r(): number {
    return this.attributes.r;
  }

  set r(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "r",
      v,
      this.attributes.r,
      Interp.numberInterp,
    );
  }

  getR(): number {
    return this.r;
  }

  getRadius(): number {
    return this.getR();
  }

  setR(r: number): this {
    this.r = r;
    return this;
  }

  setRadius(r: number): this {
    return this.setR(r);
  }

  onRChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("r", listener);
  }

  offRChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("r", listener);
  }
}
