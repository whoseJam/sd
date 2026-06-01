import type { SDFilter } from "@/Node/Filter/Filter";
import type { Group } from "@/Node/Other/Group";
import type { SDNodeAttributes, TransformOrigin } from "@/Node/SDNode";
import type { StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { SDColor } from "@/Utility/Color";

import { Interp } from "@/Animate/Interp";
import { Filter } from "@/Node/Filter/Filter";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Color as C } from "@/Utility/Color";

export type CircleAttributes = SDNodeAttributes & {
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
      cx: args?.cx ?? args?.centerX ?? 0,
      cy: args?.cy ?? args?.centerY ?? 0,
      r: args?.r ?? 20,
    };

    this.renderer = this.createSVGNode("circle", {
      cx: this.attributes.cx,
      cy: this.attributes.cy,
      r: this.attributes.r,
      transformOrigin: args?.transformOrigin ?? ["center", "center"],
      translate: args?.translate ?? [0, 0],
      rotate: args?.rotate ?? 0,
      scale: args?.scale ?? [1, 1],
      opacity: args?.opacity ?? 1,
      fill: args?.fill ?? C.black,
      fillOpacity: args?.fillOpacity ?? 1,
      stroke: args?.stroke ?? C.none,
      strokeOpacity: args?.strokeOpacity ?? 1,
      strokeWidth: args?.strokeWidth ?? 1,
      strokeDashOffset: args?.strokeDashOffset ?? args?.strokeDashoffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(
        args?.strokeDashArray ?? args?.strokeDasharray,
      ),
      strokeLineCap: args?.strokeLineCap ?? "butt",
      strokeLineJoin: args?.strokeLineJoin ?? "miter",
      filter: Filter.toURLString(args?.filter),
    });

    args?.targetNode?.appendChild(this);
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

  getCenterX(): number {
    return this.getCx();
  }

  setCenterX(cx: number): this {
    return this.setCx(cx);
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

  getCenterY(): number {
    return this.getCy();
  }

  setCenterY(cy: number): this {
    return this.setCy(cy);
  }

  onCenterYChanged(listener: (vn: number, vo: number) => void) {
    return this.onCyChanged(listener);
  }

  offCenterYChanged(listener: (vn: number, vo: number) => void) {
    return this.offCyChanged(listener);
  }

  setCenter(center: [number, number]): this;
  setCenter(cx: number, cy: number): this;
  setCenter(cx: number | [number, number], cy?: number) {
    if (Array.isArray(cx)) return this.setCenter(cx[0], cx[1]);
    return this.setCenterX(cx).setCenterY(cy);
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

  getX(): number {
    return this.getCenterX() - this.getR();
  }

  setX(x: number): this {
    return this.setCenterX(this.getCenterX() + x - this.getX());
  }

  getY(): number {
    return this.getCenterY() - this.getR();
  }

  setY(y: number): this {
    return this.setCenterY(this.getCenterY() + y - this.getY());
  }

  getWidth(): number {
    return this.getR() * 2;
  }

  setWidth(width: number): this {
    return this.setR(width / 2);
  }

  getHeight(): number {
    return this.getR() * 2;
  }

  setHeight(height: number): this {
    return this.setR(height / 2);
  }
}
