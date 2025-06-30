import { Vector as V } from "@/Math/Vector";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { polygon } from "@flatten-js/core";

export class Circle {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { CircleHTML } = require("@/Node/Shape/CircleHTML");
            return new CircleHTML(target);
        } else {
            const { CircleSVG } = require("@/Node/Shape/CircleSVG");
            return new CircleSVG(target);
        }
    }
}

Object.assign(Circle.prototype, {
    toPolygon() {
        const vertices = [];
        for (let i = 0; i < 128; i++) {
            const direction = V.makeComplex(this.r(), Math.PI * 2 * (i / 128));
            const at = V.add(this.center(), direction);
            vertices.push(at);
        }
        return polygon(vertices);
    },
});
