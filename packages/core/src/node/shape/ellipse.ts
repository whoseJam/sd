import type { AABB } from "@/math/aabb";
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

  getLocalBox(): AABB {
    const { cx, cy, rx, ry } = this.attributes;
    return { x: cx - rx, y: cy - ry, width: 2 * rx, height: 2 * ry };
  }

  protected containsLocalPoint(p: [number, number]): boolean {
    const { cx, cy, rx, ry } = this.attributes;
    if (rx === 0 || ry === 0) return false;
    const dx = (p[0] - cx) / rx;
    const dy = (p[1] - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }

  setX(x: number): this {
    return this.setCx(x + this.attributes.rx);
  }

  setY(y: number): this {
    return this.setCy(y + this.attributes.ry);
  }

  setWidth(width: number): this {
    return this.setRx(width / 2);
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
