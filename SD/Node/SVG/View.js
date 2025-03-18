import { Interp } from "@/Animate/Interp";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Factory } from "@/Utility/Factory";

export function View(parent) {
    BaseSVG.call(this, parent, "view");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        viewBox: {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
        },
    });

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    this.vars.associate("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
    this.vars.associate("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));
    this.vars.associate("viewBox", Factory.action(this, this._.nake, "viewBox", Interp.boxInterp));

    this._.nake.setAttribute("x", this.vars.x);
    this._.nake.setAttribute("y", this.vars.y);
    this._.nake.setAttribute("width", this.vars.width);
    this._.nake.setAttribute("height", this.vars.height);
    this._.nake.setAttribute("viewBox", this.vars.viewBox);
}

View.prototype = {
    ...BaseSVG.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    push(element) {
        element.attachTo(this._.nake);
        this.childAs(element);
    },
    viewBox(x, y, width, height) {
        if (arguments.length === 0) return this.vars.viewBox;
        if (arguments.length === 1) {
            const viewBox = arguments[0];
            return this.viewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
        }
        this.vars.viewBox = {
            x,
            y,
            width,
            height,
        };
        return this;
    },
};
