import type { SDBox } from "@/node/node";

import { SDSVGNode } from "@/node/svg-node";
import { RenderNode } from "@/renderer/render-node";

export class Marker extends SDSVGNode {
  /* model fields:

        marker: RenderNode;
        */
  constructor() {
    super();

    this.marker = this.createSVGNode("marker", {});
  }
  getX() {
    return 0;
  }
  getY() {
    return 0;
  }
  getWidth() {
    return 0;
  }
  getHeight() {
    return 0;
  }
  setID(id: string | number) {
    this.marker.setAttribute("id", id);
    return this;
  }
  setMarkerUnits(unit: string) {
    this.marker.setAttribute("markerUnits", unit);
    return this;
  }
  setViewBox(box: SDBox) {
    this.marker.setAttribute("viewBox", box);
    return this;
  }
  setRefX(x: number) {
    this.marker.setAttribute("refX", x);
    return this;
  }
  setRefY(y: number) {
    this.marker.setAttribute("refY", y);
    return this;
  }
  setMarkerWidth(width: number) {
    this.marker.setAttribute("markerWidth", width);
    return this;
  }
  setMarkerHeight(height: number) {
    this.marker.setAttribute("markerHeight", height);
    return this;
  }
  setContent(content: string) {
    this.marker.setAttribute("innerHTML", content);
    return this;
  }
}
