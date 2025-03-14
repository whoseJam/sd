import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { BaseNake } from "@/Node/Nake/BaseNake";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function Circle(parent) {
    BaseNake.call(this, parent, "circle");

    this.type("Circle");

    this.vars.fill = C.white;
    this.vars.stroke = C.black;
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

Circle.prototype = {
    ...BaseNake.prototype,
    r: Factory.handlerLowPrecise("r"),
    cx: Factory.handlerLowPrecise("cx"),
    cy: Factory.handlerLowPrecise("cy"),
    inRange: function (vec) {
        return V.length(V.sub(this.center(), vec)) <= this.r();
    },
    x: function (x) {
        if (x === undefined) return this.cx() - this.r();
        return this.cx(x - this.x() + this.cx());
    },
    y: function (y) {
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
