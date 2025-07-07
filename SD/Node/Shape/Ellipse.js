import { Vector as V } from "@/Math/Vector";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { Check } from "@/Utility/Check";
import { polygon } from "@flatten-js/core";

export class Ellipse {
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
    rx(rx) {
        if (arguments.length === 0) return this.vars.rx;
        Check.validateNumber(rx, `${this.constructor.name}.rx`);
        this.vars.lpset("rx", rx);
        return this;
    },
    ry(ry) {
        if (arguments.length === 0) return this.vars.ry;
        Check.validateNumber(ry, `${this.constructor.name}.ry`);
        this.vars.lpset("ry", ry);
        return this;
    },
    width(width) {
        if (width === undefined) return this.rx() * 2;
        return this.rx(width / 2);
    },
    height(height) {
        if (height === undefined) return this.ry() * 2;
        return this.ry(height / 2);
    },
});
