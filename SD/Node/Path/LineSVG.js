import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { BasePath } from "@/Node/Path/BasePath";
import { BaseSVG } from "@/Node/Path/BaseSVG";
import { Line } from "@/Node/Path/Line";
import { Factory } from "@/Utility/Factory";

export class LineSVG extends BasePath {
    constructor(target, value) {
        super(target);

        BaseSVG.call(this, "line");

        this.type("LineSVG");

        this.vars.merge({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
        });

        this._.nake.setAttribute("x1", this.vars.x1);
        this._.nake.setAttribute("y1", this.vars.y1);
        this._.nake.setAttribute("x2", this.vars.x2);
        this._.nake.setAttribute("y2", this.vars.y2);

        this.vars.watch("x1", Factory.action(this, this._.nake, "x1", Interp.numberInterp));
        this.vars.watch("y1", Factory.action(this, this._.nake, "y1", Interp.numberInterp));
        this.vars.watch("x2", Factory.action(this, this._.nake, "x2", Interp.numberInterp));
        this.vars.watch("y2", Factory.action(this, this._.nake, "y2", Interp.numberInterp));

        this.value(value);
    }
}

LineSVG.extend(Line);

Object.assign(LineSVG.prototype, {
    ...Line.prototype,
    ...BaseSVG.prototype,
    x(x) {
        const x1 = this.x1();
        const x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (x === undefined) return ox;
        const dx = x - ox;
        this.freeze();
        this.x1(x1 + dx);
        this.x2(x2 + dx);
        this.unfreeze();
        return this;
    },
    y(y) {
        const y1 = this.y1();
        const y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (y === undefined) return oy;
        const dy = y - oy;
        this.freeze();
        this.y1(y1 + dy);
        this.y2(y2 + dy);
        this.unfreeze();
        return this;
    },
    width(width) {
        const x1 = this.x1();
        const x2 = this.x2();
        if (width === undefined) return Math.abs(x1 - x2);
        if (x1 < x2) this.x2(x1 + width);
        else this.x1(x2 + width);
        return this;
    },
    height(height) {
        const y1 = this.y1();
        const y2 = this.y2();
        if (height === undefined) return Math.abs(y1 - y2);
        if (y1 < y2) this.y2(y1 + height);
        else this.y1(y2 + height);
        return this;
    },
    at(k) {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        return V.add(v1, V.numberMul(d, k));
    },
    getPointAtLength(length) {
        const total = this.totalLength();
        const k = length / total;
        return this.at(k);
    },
    totalLength() {
        const v1 = this.source();
        const v2 = this.target();
        return V.length(V.sub(v1, v2));
    },
    x1: Factory.handlerLowPrecise("x1"),
    y1: Factory.handlerLowPrecise("y1"),
    x2: Factory.handlerLowPrecise("x2"),
    y2: Factory.handlerLowPrecise("y2"),
    source(x, y) {
        if (arguments.length === 0) {
            return [this.x1(), this.y1()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.source(point[0], point[1]);
        }
        this.freeze().x1(x).y1(y).unfreeze();
        return this;
    },
    target(x, y) {
        if (arguments.length === 0) {
            return [this.x2(), this.y2()];
        } else if (arguments.length === 1) {
            const point = arguments[0];
            return this.target(point[0], point[1]);
        }
        this.freeze().x2(x).y2(y).unfreeze();
        return this;
    },
});
