import { getTargetLayer } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class Rect extends BaseShape {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { RectHTML } = require("@/Node/Shape/RectHTML");
            return new RectHTML(target);
        } else {
            const { RectSVG } = require("@/Node/Shape/RectSVG");
            return new RectSVG(target);
        }
    }
}

Object.assign(Rect.prototype, {
    toPolygon() {
        return polygon([
            this.pos("x", "y"),
            this.pos("mx", "y"),
            this.pos("mx", "my"),
            this.pos("x", "my"),
        ]);
    },
});
