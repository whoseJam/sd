import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { Circle } from "@/Node/Shape/Circle";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Factory } from "@/Utility/Factory";

export function CircleSVG(target) {
    BaseShapeSVG.call(this, target, "circle");

    this.type("CircleSVG");

    this.vars.merge({
        r: 20,
        cx: 20,
        cy: 20,
    });

    this.vars.associate("r", Factory.action(this, this._.nake, "r", Interp.numberInterp));
    this.vars.associate("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));

    this._.nake.setAttribute("cx", this.vars.cx);
    this._.nake.setAttribute("cy", this.vars.cy);
    this._.nake.setAttribute("r", this.vars.r);
}

CircleSVG.prototype = {
    ...BaseShapeSVG.prototype,
    ...Circle.prototype,
    r: Factory.handlerLowPrecise("r"),
    cx: Factory.handlerLowPrecise("cx"),
    cy: Factory.handlerLowPrecise("cy"),
    inRange(vec) {
        return V.length(V.sub(this.center(), vec)) <= this.r();
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
};
