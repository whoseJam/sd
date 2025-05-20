import { Interp } from "@/Animate/Interp";
import { Rect } from "@/Node/Shape/Rect";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Factory } from "@/Utility/Factory";

export function RectSVG(target) {
    BaseShapeSVG.call(this, target, "rect");

    this.type("RectSVG");

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

RectSVG.prototype = {
    ...BaseShapeSVG.prototype,
    ...Rect.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
};
