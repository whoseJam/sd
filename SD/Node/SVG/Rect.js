import { Interp } from "@/Animate/Interp";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function Rect(target) {
    BaseSVG.call(this, target, "rect");

    this.type("Rect");

    this.vars.fill = C.white;
    this.vars.stroke = C.black;
    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
    });

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    this.vars.associate("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
    this.vars.associate("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));

    this._.nake.setAttribute("x", this.vars.x);
    this._.nake.setAttribute("y", this.vars.y);
    this._.nake.setAttribute("width", this.vars.width);
    this._.nake.setAttribute("height", this.vars.height);
}

Rect.prototype = {
    ...BaseSVG.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
};
