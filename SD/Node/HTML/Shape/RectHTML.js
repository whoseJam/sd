import { Interp } from "@/Animate/Interp";
import { BaseShapeHTML } from "@/Node/HTML/Shape/BaseShapeHTML";
import { Rect } from "@/Node/Shape/Rect";
import { Factory } from "@/Utility/Factory";

export function RectHTML(target) {
    BaseShapeHTML.call(this, target, "div");

    this.type("RectHTML");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
    });

    this._.layer.setAttribute("width", `${this.vars.width}px`);
    this._.layer.setAttribute("height", `${this.vars.height}px`);

    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
}

RectHTML.prototype = {
    ...BaseShapeHTML.prototype,
    ...Rect.prototype,
};
