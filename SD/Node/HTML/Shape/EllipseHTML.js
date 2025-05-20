import { Interp } from "@/Animate/Interp";
import { BaseShapeHTML } from "@/Node/HTML/Shape/BaseShapeHTML";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Factory } from "@/Utility/Factory";

export function EllipseHTML(target) {
    BaseShapeHTML.call(this, target, "div");

    this.type("EllipseHTML");

    this.vars.merge({
        x: 0,
        y: 0,
        rx: 20,
        ry: 20,
    });

    this._.layer.setAttribute("width", `${this.vars.rx * 2}px`);
    this._.layer.setAttribute("height", `${this.vars.ry * 2}px`);
    this._.nake.setAttribute("border-radius", "50%");

    const helper = createHelper(this._.layer);
    this.vars.associate("rx", Factory.action(this, helper, "width", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, helper, "height", Interp.numberInterp));
}

EllipseHTML.prototype = {
    ...BaseShapeHTML.prototype,
    ...Ellipse.prototype,
    rx: Factory.handlerLowPrecise("rx"),
    ry: Factory.handlerLowPrecise("ry"),
    width(width) {
        if (arguments.length === 0) return this.vars.rx * 2;
        return this.rx(width / 2);
    },
    height(height) {
        if (arguments.length === 0) return this.vars.ry * 2;
        return this.ry(height / 2);
    },
};

function createHelper(layer) {
    return {
        setAttribute(key, value) {
            layer.setAttribute(key, `${value * 2}px`);
        },
    };
}
