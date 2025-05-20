import { RectHTML } from "@/Node/HTML/Shape/RectHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { RectSVG } from "@/Node/SVG/Shape/RectSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { polygon } from "@flatten-js/core";

export function Rect(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new RectHTML(target);
    } else {
        return new RectSVG(target);
    }
}

Rect.prototype = {
    toPolygon() {
        return polygon([
            // format
            this.pos("x", "y"),
            this.pos("mx", "y"),
            this.pos("mx", "my"),
            this.pos("x", "my"),
        ]);
    },
};
