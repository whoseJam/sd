import { Vector as V } from "@/Math/Vector";
import { CircleHTML } from "@/Node/HTML/Shape/CircleHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { CircleSVG } from "@/Node/SVG/Shape/CircleSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { polygon } from "@flatten-js/core";

export function Circle(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new CircleHTML(target);
    } else {
        return new CircleSVG(target);
    }
}

Circle.prototype = {
    toPolygon() {
        const vertices = [];
        for (let i = 0; i < 128; i++) {
            const direction = V.makeComplex(this.r(), Math.PI * 2 * (i / 128));
            const at = V.add(this.center(), direction);
            vertices.push(at);
        }
        return polygon(vertices);
    },
};
