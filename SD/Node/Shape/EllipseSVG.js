import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { BaseSVG } from "@/Node/Shape/BaseSVG";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class EllipseSVG extends BaseShape {
    constructor(target) {
        super(target, "ellipse");

        BaseSVG.call(this, "ellipse");

        this.type("EllipseSVG");

        this.vars.merge({
            rx: 20,
            ry: 20,
            cx: 20,
            cy: 20,
        });

        this._.nake.setAttribute("cx", this.vars.cx);
        this._.nake.setAttribute("cy", this.vars.cy);
        this._.nake.setAttribute("rx", this.vars.rx);
        this._.nake.setAttribute("ry", this.vars.ry);

        this.vars.watch("rx", Factory.action(this, this._.nake, "rx", Interp.numberInterp));
        this.vars.watch("ry", Factory.action(this, this._.nake, "ry", Interp.numberInterp));
        this.vars.watch("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
        this.vars.watch("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));
    }
}

EllipseSVG.extend(Ellipse);

Object.assign(EllipseSVG.prototype, {
    ...Ellipse.prototype,
    ...BaseSVG.prototype,
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
    rx(rx) {
        if (arguments.length === 0) return this.vars.rx;
        Check.validateNumber(rx, `${this.type()}.rx`);
        this.vars.lpset("rx", rx);
        return this;
    },
    ry(ry) {
        if (arguments.length === 0) return this.vars.ry;
        Check.validateNumber(ry, `${this.type()}.ry`);
        this.vars.lpset("ry", ry);
        return this;
    },
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
});
