import type { AABB } from "@/math/aabb";
import type { RenderNode } from "@/renderer/render-node";

import { SDSVGNode } from "@/node/svg-node";

// Markers are <defs> — they have no on-canvas footprint.
export class Marker extends SDSVGNode {
  marker!: RenderNode;

  constructor() {
    super();

    this.marker = this.createSVGNode("marker", {});
  }
  getLocalBox(): AABB {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  setID(id: string | number) {
    this.marker.setAttribute("id", id);
    return this;
  }
  setMarkerUnits(unit: string) {
    this.marker.setAttribute("markerUnits", unit);
    return this;
  }
  setViewBox(box: AABB) {
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
