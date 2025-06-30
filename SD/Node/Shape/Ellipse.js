import { Vector as V } from "@/Math/Vector";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { polygon } from "@flatten-js/core";
import { BaseShape } from "./BaseShape";

export class Ellipse extends BaseShape {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { EllipseHTML } = require("@/Node/Shape/EllipseHTML");
            return new EllipseHTML(target);
        } else {
            const { EllipseSVG } = require("@/Node/Shape/EllipseSVG");
            return new EllipseSVG(target);
        }
    }
}

Object.assign(Ellipse.prototype, {
    toPolygon() {
        const vertices = [];
        for (let i = 0; i < 128; i++) {
            const direction = [
                this.rx() * Math.cos(Math.PI * 2 * (i / 128)),
                this.ry() * Math.sin(Math.PI * 2 * (i / 128)),
            ];
            const at = V.add(this.center(), direction);
            vertices.push(at);
        }
        return polygon(vertices);
    },
});
