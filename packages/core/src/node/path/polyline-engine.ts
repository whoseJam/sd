import { Root, svg } from "@/interact/root";
import { RenderNode } from "@/renderer/render-node";

export class PolylineEngine {
  static polylineSVG = undefined;
  static init() {
    this.polylineSVG = RenderNode.createRenderNodeWithoutAction(
      undefined,
      Root.svg,
      "polyline",
    );
    this.polylineSVG.setAttribute("opacity", 0);
  }
  static toBox(points: Array<[number, number]>) {
    if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    let x = points[0][0];
    let y = points[0][1];
    let mx = x;
    let my = y;
    for (let i = 1; i < points.length; i++) {
      x = Math.min(x, points[i][0]);
      y = Math.min(y, points[i][1]);
      mx = Math.max(mx, points[i][0]);
      my = Math.max(my, points[i][1]);
    }
    return { x, y, width: mx - x, height: my - y };
  }
  static getPointAtLength(
    points: Array<[number, number]>,
    length: number,
  ): [number, number] {
    try {
      this.polylineSVG.setAttribute("points", points);
      const point = this.polylineSVG.element().getPointAtLength(length);
      return [point.x, point.y];
    } catch (err) {
      return [0, 0];
    }
  }
  static getPointByRate(
    points: Array<[number, number]>,
    k: number,
  ): [number, number] {
    try {
      this.polylineSVG.setAttribute("points", points);
      const length = this.polylineSVG.element().getTotalLength() * k;
      const point = this.polylineSVG.element().getPointAtLength(length);
      return [point.x, point.y];
    } catch (err) {
      return [0, 0];
    }
  }
  static getTotalLength(points: Array<[number, number]>) {
    try {
      this.polylineSVG.setAttribute("points", points);
      return this.polylineSVG.element().getTotalLength();
    } catch (err) {
      return 0;
    }
  }
}
