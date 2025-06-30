import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { BaseSVG } from "@/Node/Shape/BaseSVG";
import { Circle } from "@/Node/Shape/Circle";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class CircleSVG extends BaseShape {
    constructor(target) {
        super(target);

        BaseSVG.call(this, "circle");

        this.type("CircleSVG");

        this.vars.merge({
            r: 20,
            cx: 20,
            cy: 20,
        });

        this._.nake.setAttribute("cx", this.vars.cx);
        this._.nake.setAttribute("cy", this.vars.cy);
        this._.nake.setAttribute("r", this.vars.r);

        this.vars.watch("r", Factory.action(this, this._.nake, "r", Interp.numberInterp));
        this.vars.watch("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
        this.vars.watch("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));
    }
}

CircleSVG.extend(Circle);

Object.assign(CircleSVG.prototype, {
    ...Circle.prototype,
    ...BaseSVG.prototype,
    r(r) {
        if (arguments.length === 0) return this.vars.r;
        Check.validateNumber(r, `${this.constructor.name}.r`);
        this.vars.lpset("r", r);
        return this;
    },
    cx(cx) {
        if (arguments.length === 0) return this.vars.cx;
        Check.validateNumber(cx, `${this.constructor.name}.cx`);
        this.vars.lpset("cx", cx);
        return this;
    },
    cy(cy) {
        if (arguments.length === 0) return this.vars.cy;
        Check.validateNumber(cy, `${this.constructor.name}.cy`);
        this.vars.lpset("cy", cy);
        return this;
    },
    x(x) {
        if (x === undefined) return this.cx() - this.r();
        return this.cx(x - this.x() + this.cx());
    },
    y(y) {
        if (y === undefined) return this.cy() - this.r();
        return this.cy(y - this.y() + this.cy());
    },
    width(width) {
        if (width === undefined) return this.r() * 2;
        return this.r(width / 2);
    },
    height(height) {
        if (height === undefined) return this.r() * 2;
        return this.r(height / 2);
    },
    inRange(vec) {
        return V.length(V.sub(this.center(), vec)) <= this.r();
    },
});
