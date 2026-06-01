import type { SDFilter } from "@/Node/Filter/Filter";
import type { Group } from "@/Node/Other/Group";
import type { SDNodeAttributes } from "@/Node/SDNode";
import type { StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";
import type { RenderNode } from "@/Renderer/RenderNode";
import type { SDColor } from "@/Utility/Color";

import { Interp } from "@/Animate/Interp";
import { Filter } from "@/Node/Filter/Filter";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Color as C } from "@/Utility/Color";

export type RectAttributes = SDNodeAttributes & {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
};

export class Rect extends BaseShape {
  declare attributes: RectAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "y") return renderer.setAttribute("y", -(value + this.height));
    super.renderAttribute(renderer, key, value);
  }

  constructor(args?: {
    targetNode?: Group;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    centerX?: number;
    centerY?: number;
    width?: number;
    height?: number;
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
      x: args?.x ?? 0,
      y: args?.y ?? 0,
      width: args?.width ?? 40,
      height: args?.height ?? 40,
      rx: args?.rx ?? 0,
      ry: args?.ry ?? 0,
    };

    this.createSVGNode("rect", {
      x: this.attributes.x,
      y: this.attributes.y,
      width: this.attributes.width,
      height: this.attributes.height,
      rx: this.attributes.rx,
      ry: this.attributes.ry,
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

    if (args?.cx !== undefined) this.setCx(args.cx);
    if (args?.cy !== undefined) this.setCy(args.cy);
    if (args?.centerX !== undefined) this.setCenterX(args.centerX);
    if (args?.centerY !== undefined) this.setCenterY(args.centerY);

    args?.targetNode?.appendChild(this);
  }

  get x(): number {
    return this.attributes.x;
  }

  set x(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "x",
      v,
      this.attributes.x,
      Interp.numberInterp,
    );
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  onXChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("x", listener);
  }

  offXChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("x", listener);
  }

  get y(): number {
    return this.attributes.y;
  }

  set y(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "y",
      v,
      this.attributes.y,
      Interp.numberInterp,
    );
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  onYChanged(listener: (vn: number, vo: number) => void) {
    return this.onAttributeChanged("y", listener);
  }

  offYChanged(listener: (vn: number, vo: number) => void) {
    return this.offAttributeChanged("y", listener);
  }

  get width(): number {
    return this.attributes.width;
  }

  set width(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "width",
      v,
      this.attributes.width,
      Interp.numberInterp,
    );
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  onWidthChanged(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("width", listener);
  }

  offWidthChanged(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("width", listener);
  }

  get height(): number {
    return this.attributes.height;
  }

  // SVG y depends on height (svg_y = -(y + height)); a height change must
  // re-fire the y attribute so renderAttribute reads the new height every
  // tick and the math-y anchor stays put.
  set height(v: number) {
    this.triggerAttributeChanged(
      this.renderer,
      "height",
      v,
      this.attributes.height,
      Interp.numberInterp,
    );
    this.triggerAttributeChanged(
      this.renderer,
      "y",
      this.attributes.y,
      this.attributes.y,
      Interp.numberInterp,
    );
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  onHeightChanged(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("height", listener);
  }

  offHeightChanged(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("height", listener);
  }

  setCenterX(cx: number) {
    return this.setX(this.getX() + cx - this.getCenterX());
  }

  setCx(cx: number) {
    return this.setCenterX(cx);
  }

  setCenterY(cy: number) {
    return this.setY(this.getY() + cy - this.getCenterY());
  }

  setCy(cy: number) {
    return this.setCenterY(cy);
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

  onRxChanged(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("rx", listener);
  }

  offRxChanged(listener: (vn: number, vo: number) => void): this {
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

  onRyChanged(listener: (vn: number, vo: number) => void): this {
    return this.onAttributeChanged("ry", listener);
  }

  offRyChanged(listener: (vn: number, vo: number) => void): this {
    return this.offAttributeChanged("ry", listener);
  }

  setBorderRadius(r: number): this {
    return this.setRx(r).setRy(r);
  }
}
