import { Root } from "@/Interact/Root";
import { RenderNode } from "@/Renderer/RenderNode";

export class PolygonEngine {
  static polygonSVG = undefined;
  static init() {
    this.polygonSVG = RenderNode.createRenderNodeWithoutAction(
      undefined,
      Root.svg,
      "polygon",
    );
    this.polygonSVG.setAttribute("opacity", 0);
  }
  static pointsToBox(points: Array<[number, number]>) {
    if (points.length < 3)
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
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
    return {
      x,
      y,
      width: mx - x,
      height: my - y,
    };
  }
}
