import { Interp } from "@/Animate/Interp";
import { Image } from "@/Node/Shape/Image";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Factory } from "@/Utility/Factory";

export function ImageSVG(target) {
    BaseShapeSVG.call(this, target, "image");

    this.type("ImageSVG");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        href: "",
    });

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    this.vars.associate("href", Factory.action(this, this._.nake, "href", Interp.stringInterp));
    this.vars.associate("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
    this.vars.associate("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));

    this._.nake.setAttribute("x", this.vars.x);
    this._.nake.setAttribute("y", this.vars.y);
    this._.nake.setAttribute("width", this.vars.width);
    this._.nake.setAttribute("height", this.vars.height);
    this._.nake.setAttribute("preserveAspectRatio", "xMidYMid meet");
}

ImageSVG.prototype = {
    ...BaseShapeSVG.prototype,
    ...Image.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    href: Factory.handler("href"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
};
