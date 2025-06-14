import { Interp } from "@/Animate/Interp";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Factory } from "@/Utility/Factory";

export function EllipseSVG(parent) {
    BaseShapeSVG.call(this, parent, "ellipse");

    this.type("EllipseSVG");

    this.vars.merge({
        rx: 20,
        ry: 20,
        cx: 20,
        cy: 20,
    });

    this.vars.associate("rx", Factory.action(this, this._.nake, "rx", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.nake, "ry", Interp.numberInterp));
    this.vars.associate("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));

    this._.nake.setAttribute("cx", this.vars.cx);
    this._.nake.setAttribute("cy", this.vars.cy);
    this._.nake.setAttribute("rx", this.vars.rx);
    this._.nake.setAttribute("ry", this.vars.ry);
}

EllipseSVG.prototype = {
    ...BaseShapeSVG.prototype,
    ...Ellipse.prototype,
    cx: Factory.handlerLowPrecise("cx"),
    cy: Factory.handlerLowPrecise("cy"),
    rx: Factory.handlerLowPrecise("rx"),
    ry: Factory.handlerLowPrecise("ry"),
    x(x) {
        if (x === undefined) return this.cx() - this.rx();
        return this.cx(x - this.x() + this.cx());
    },
    y(y) {
        if (y === undefined) return this.cy() - this.ry();
        return this.cy(y - this.y() + this.cy());
    },
    width(width) {
        if (width === undefined) return this.rx() * 2;
        return this.rx(width / 2);
    },
    height(height) {
        if (height === undefined) return this.ry() * 2;
        return this.ry(height / 2);
    },
};
