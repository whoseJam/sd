import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Image } from "@/Node/Shape/Image";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";
import { BaseSVG } from "./BaseSVG";

export class ImageSVG extends BaseShape {
    constructor(target) {
        super(target);

        BaseSVG.call(this, "image");

        this.type("ImageSVG");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            href: "",
        });

        this._.nake.setAttribute("x", this.vars.x);
        this._.nake.setAttribute("y", this.vars.y);
        this._.nake.setAttribute("width", this.vars.width);
        this._.nake.setAttribute("height", this.vars.height);
        this._.nake.setAttribute("preserveAspectRatio", "xMidYMid meet");

        this.vars.watch("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
        this.vars.watch("href", Factory.action(this, this._.nake, "href", Interp.stringInterp));
        this.vars.watch("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
        this.vars.watch("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));
    }
}

ImageSVG.extend(Image);

Object.assign(ImageSVG.prototype, {
    ...Image.prototype,
    ...BaseSVG.prototype,
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    },
});
