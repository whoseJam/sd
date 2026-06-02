import type { SDFilter } from "@/node/filter/filter";
import type { TransformOrigin } from "@/node/node";
import type { Group } from "@/node/other/group";
import type { SDSVGNodeAttributes } from "@/node/svg-node";
import type { StrokeLineCap, StrokeLineJoin } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";
import type { SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { Filter } from "@/node/filter/filter";
import { BasePath } from "@/node/path/base-path";
import { PolylineEngine } from "@/node/path/polyline-engine";
import { SDSVGNode } from "@/node/svg-node";
import { Color as C } from "@/utility/color";

export type PolylineAttributes = SDSVGNodeAttributes & {
  points: Array<[number, number]>;
};

export class Polyline extends BasePath {
  declare attributes: PolylineAttributes;

  renderAttribute(renderer: RenderNode, key: string, value: any) {
    if (key === "points") {
      const flipped = (value as Array<[number, number]>).map(
        ([px, py]) => [px, -py] as [number, number],
      );
      return renderer.setAttribute("points", flipped);
    }
    super.renderAttribute(renderer, key, value);
  }

  constructor(args?: {
    targetNode?: Group;
    points?: Array<[number, number]>;
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
      fillOpacity: args?.fillOpacity ?? 1,
      strokeOpacity: args?.strokeOpacity ?? 1,
      strokeWidth: args?.strokeWidth ?? 1,
      strokeDashOffset: args?.strokeDashOffset ?? args?.strokeDashoffset ?? 0,
      strokeDashArray: SDSVGNode.toStrokeDashArray(
        args?.strokeDashArray ?? args?.strokeDasharray,
      ),
      strokeLineCap: args?.strokeLineCap ?? "butt",
      strokeLineJoin: args?.strokeLineJoin ?? "miter",
      points: args?.points ?? [],
    };

    this.createSVGNode("polyline", {
      filter: Filter.toURLString(args?.filter),
    });

    args?.targetNode?.appendChild(this);
  }

  getX() {
    return PolylineEngine.toBox(this.points).x;
  }

  getY() {
    return PolylineEngine.toBox(this.points).y;
  }

  getWidth() {
    return PolylineEngine.toBox(this.points).width;
  }

  getHeight() {
    return PolylineEngine.toBox(this.points).height;
  }

  getPointAtRate(k: number) {
    return PolylineEngine.getPointByRate(this.points, k);
  }

  getPointAtLength(length: number): [number, number] {
    return PolylineEngine.getPointAtLength(this.points, length);
  }

  totalLength(): number {
    return PolylineEngine.getTotalLength(this.points);
  }

  get points(): Array<[number, number]> {
    return this.attributes.points;
  }

  set points(v: Array<[number, number]>) {
    this.triggerAttributeChanged(
      this.renderer,
      "points",
      v,
      this.attributes.points,
      Interp.pointsInterp,
    );
  }

  getPoints(): Array<[number, number]> {
    return this.points;
  }

  setPoints(points: Array<[number, number]>): this {
    this.points = points;
    return this;
  }

  onPointsChanged(
    listener: (
      vn: Array<[number, number]>,
      vo: Array<[number, number]>,
    ) => void,
  ): this {
    return this.onAttributeChanged("points", listener);
  }

  offPointsChanged(
    listener: (
      vn: Array<[number, number]>,
      vo: Array<[number, number]>,
    ) => void,
  ): this {
    return this.offAttributeChanged("points", listener);
  }
}
