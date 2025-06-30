import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/Shape/BaseHTML";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Rect } from "@/Node/Shape/Rect";
import { Factory } from "@/Utility/Factory";

export class RectHTML extends BaseShape {
    constructor(target) {
        super(target, "div");

        this.type("RectHTML");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
        });

        this._.layer.setAttribute("width", `${this.vars.width}px`);
        this._.layer.setAttribute("height", `${this.vars.height}px`);

        this.vars.watch("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
        this.vars.watch("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
    }
}

RectHTML.extend(Rect);

Object.assign(RectHTML.prototype, {
    ...Rect.prototype,
    ...BaseHTML.prototype,
});
