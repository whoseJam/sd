import { Interp } from "@/Animate/Interp";
import { BaseShapeHTML } from "@/Node/HTML/Shape/BaseShapeHTML";
import { Image } from "@/Node/Shape/Image";
import { Factory } from "@/Utility/Factory";

export function ImageHTML(target) {
    BaseShapeHTML.call(this, target, "img");

    this.type("ImageHTML");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
    });

    this._.layer.setAttribute("width", `${this.vars.width}px`);
    this._.layer.setAttribute("height", `${this.vars.height}px`);
    this._.nake.removeAttribute("border-width");
    this._.nake.removeAttribute("border-style");
    this._.nake.removeAttribute("border-color");
    this._.nake.setAttribute("object-fit", "contain");

    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
    this.vars.associate("href", Factory.action(this, this._.nake, "src", Interp.stringInterp));
}

ImageHTML.prototype = {
    ...BaseShapeHTML.prototype,
    ...Image.prototype,
    href: Factory.handler("href"),
};
