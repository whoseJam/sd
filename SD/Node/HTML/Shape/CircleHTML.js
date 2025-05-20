import { Interp } from "@/Animate/Interp";
import { BaseShapeHTML } from "@/Node/HTML/Shape/BaseShapeHTML";
import { Circle } from "@/Node/Shape/Circle";
import { Factory } from "@/Utility/Factory";

export function CircleHTML(target) {
    BaseShapeHTML.call(this, target, "div");

    this.type("CircleHTML");

    this.vars.merge({
        x: 0,
        y: 0,
        r: 20,
    });

    this._.layer.setAttribute("width", `${this.vars.r * 2}px`);
    this._.layer.setAttribute("height", `${this.vars.r * 2}px`);
    this._.nake.setAttribute("border-radius", "50%");

    const helper = createHelper(this._.layer);
    this.vars.associate("r", Factory.action(this, helper, "width", Interp.numberInterp));
    this.vars.associate("r", Factory.action(this, helper, "height", Interp.numberInterp));
}

CircleHTML.prototype = {
    ...BaseShapeHTML.prototype,
    ...Circle.prototype,
    r: Factory.handlerLowPrecise("r"),
    width(width) {
        if (arguments.length === 0) return this.vars.r * 2;
        return this.r(width / 2);
    },
    height(height) {
        if (arguments.length === 0) return this.vars.r * 2;
        return this.r(height / 2);
    },
};

function createHelper(layer) {
    return {
        setAttribute(key, value) {
            layer.setAttribute(key, `${value * 2}px`);
        },
    };
}
