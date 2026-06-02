import type { SDFilter } from "@/node/filter/filter";
import type { Group } from "@/node/other/group";
import type { SDSVGNodeAttributes } from "@/node/svg-node";
import type { StrokeLineCap, StrokeLineJoin } from "@/node/svg-node";
import type { RenderNode } from "@/renderer/render-node";
import type { SDColor } from "@/utility/color";

import { Interp } from "@/animate/interp";
import { Filter } from "@/node/filter/filter";
import { BaseShape } from "@/node/shape/base-shape";
import { PolygonEngine } from "@/node/shape/polygon-engine";
import { SDSVGNode } from "@/node/svg-node";
import { Color as C } from "@/utility/color";

export type PolygonAttributes = SDSVGNodeAttributes & {
  points: Array<[number, number]>;
};

export class Polygon extends BaseShape {
  declare attributes: PolygonAttributes;

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
    points?: string | Array<[number, number]>;
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
      transformOrigin: ["center", "center"],
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
      points: Polygon.toPoints(args?.points),
    };

    this.renderer = this.createSVGNode("polygon", {
      filter: Filter.toURLString(args?.filter),
    });

    args?.targetNode?.appendChild(this);
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

  getX() {
    return PolygonEngine.pointsToBox(this.points).x;
  }

  getY() {
    return PolygonEngine.pointsToBox(this.points).y;
  }

  getWidth() {
    return PolygonEngine.pointsToBox(this.points).width;
  }

  getHeight() {
    return PolygonEngine.pointsToBox(this.points).height;
  }

  getPoints() {
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
  ) {
    return this.onAttributeChanged("points", listener);
  }

  offPointsChanged(
    listener: (
      vn: Array<[number, number]>,
      vo: Array<[number, number]>,
    ) => void,
  ) {
    return this.offAttributeChanged("points", listener);
  }

  setX(x: number): this {
    const box = PolygonEngine.pointsToBox(this.points);
    const dx = x - box.x;
    return this.setPoints(
      this.points.map(([px, py]) => [px + dx, py] as [number, number]),
    );
  }

  setY(y: number): this {
    const box = PolygonEngine.pointsToBox(this.points);
    const dy = y - box.y;
    return this.setPoints(
      this.points.map(([px, py]) => [px, py + dy] as [number, number]),
    );
  }

  setWidth(width: number): this {
    const box = PolygonEngine.pointsToBox(this.points);
    const scale = width / box.width;
    return this.setPoints(
      this.points.map(
        ([px, py]) => [box.x + (px - box.x) * scale, py] as [number, number],
      ),
    );
  }

  setHeight(height: number): this {
    const box = PolygonEngine.pointsToBox(this.points);
    const scale = height / box.height;
    return this.setPoints(
      this.points.map(
        ([px, py]) => [px, box.y + (py - box.y) * scale] as [number, number],
      ),
    );
  }

  private static toPoints(
    points: string | Array<[number, number]>,
  ): Array<[number, number]> {
    if (points === undefined) return [];
    if (typeof points === "string")
      return points
        .split(" ")
        .map((p) => p.split(",").map((n) => parseFloat(n)) as [number, number]);
    return points;
  }
}
