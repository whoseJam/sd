import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/Shape/BaseHTML";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Image } from "@/Node/Shape/Image";
import { Factory } from "@/Utility/Factory";

export class ImageHTML extends BaseShape {
    constructor(target) {
        super(target);

        BaseHTML.call(this, "img");

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

        this.vars.watch("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
        this.vars.watch("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
        this.vars.watch("href", Factory.action(this, this._.nake, "src", Interp.stringInterp));
    }
}

ImageHTML.extend(Image);

Object.assign(ImageHTML.prototype, {
    ...Image.prototype,
    ...BaseHTML.prototype,
});
