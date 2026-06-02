import type { SDFilter } from "@/node/filter/filter";
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

export type EllipseAttributes = SDSVGNodeAttributes & {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

export class Ellipse extends BaseShape {
  declare attributes: EllipseAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "cy") return renderer.setAttribute("cy", -value);
    super.renderAttribute(renderer, key, value);
  }

  constructor(args?: {
    targetNode?: Group;
    cx?: number;
    cy?: number;
    rx?: number;
    ry?: number;
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
      cx: args?.cx ?? 20,
      cy: args?.cy ?? 20,
      rx: args?.rx ?? 20,
      ry: args?.ry ?? 20,
    };

    this.renderer = this.createSVGNode("ellipse", {
      filter: Filter.toURLString(args?.filter) ?? "",
    });

    args?.targetNode?.appendChild(this);
  }

  getX(): number {
    return this.getCenterX() - this.getRx();
  }

  setX(x: number): this {
    return this.setCenterX(this.getCenterX() + x - this.getX());
  }

  getY(): number {
    return this.getCenterY() - this.getRy();
  }

  setY(y: number): this {
    return this.setCenterY(this.getCenterY() + y - this.getY());
  }

  getWidth(): number {
    return this.getRx() * 2;
  }

  setWidth(width: number): this {
    return this.setRx(width / 2);
  }

  getHeight(): number {
    return this.getRy() * 2;
  }

  setHeight(height: number): this {
    return this.setRy(height / 2);
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

  get rx(): number {
    return this.attributes.rx;
  }

  set rx(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "rx",
      v,
      this.attributes.rx,
      Interp.numberInterp,
    );
  }

  getRx(): number {
    return this.rx;
  }

  setRx(rx: number): this {
    this.rx = rx;
    return this;
  }

  onRxChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("rx", listener);
  }

  offRxChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("rx", listener);
  }

  get ry(): number {
    return this.attributes.ry;
  }

  set ry(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "ry",
      v,
      this.attributes.ry,
      Interp.numberInterp,
    );
  }

  getRy(): number {
    return this.ry;
  }

  setRy(ry: number): this {
    this.ry = ry;
    return this;
  }

  onRyChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("ry", listener);
  }

  offRyChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("ry", listener);
  }
}
