import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDBox } from "@/Node/SDNode";

export class Marker extends SDSVGNode {
    _: SDSVGNode["_"] & {
        marker: RenderNode;
    };
    constructor() {
        super();

        this._.marker = this.createSVGNode("marker", {});
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
        this._.marker.setAttribute("id", id);
        return this;
    }
    setMarkerUnits(unit: string) {
        this._.marker.setAttribute("markerUnits", unit);
        return this;
    }
    setViewBox(box: SDBox) {
        this._.marker.setAttribute("viewBox", box);
        return this;
    }
    setRefX(x: number) {
        this._.marker.setAttribute("refX", x);
        return this;
    }
    setRefY(y: number) {
        this._.marker.setAttribute("refY", y);
        return this;
    }
    setMarkerWidth(width: number) {
        this._.marker.setAttribute("markerWidth", width);
        return this;
    }
    setMarkerHeight(height: number) {
        this._.marker.setAttribute("markerHeight", height);
        return this;
    }
    setContent(content: string) {
        this._.marker.setAttribute("innerHTML", content);
        return this;
    }
}
