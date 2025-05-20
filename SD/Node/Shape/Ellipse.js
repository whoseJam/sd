import { Vector as V } from "@/Math/Vector";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { polygon } from "@flatten-js/core";

export function Ellipse(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        const { EllipseHTML } = require("@/Node/HTML/Shape/EllipseHTML");
        return new EllipseHTML(target);
    } else {
        const { EllipseSVG } = require("@/Node/SVG/Shape/EllipseSVG");
        return new EllipseSVG(target);
    }
}

Ellipse.prototype = {
    toPolygon() {
        const vertices = [];
        for (let i = 0; i < 128; i++) {
            const direction = [
                // format
                this.rx() * Math.cos(Math.PI * 2 * (i / 128)),
                this.ry() * Math.sin(Math.PI * 2 * (i / 128)),
            ];
            const at = V.add(this.center(), direction);
            vertices.push(at);
        }
        return polygon(vertices);
    },
};
