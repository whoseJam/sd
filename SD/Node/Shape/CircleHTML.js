import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/Shape/BaseHTML";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Circle } from "@/Node/Shape/Circle";
import { Factory } from "@/Utility/Factory";

export class CircleHTML extends BaseShape {
    constructor(target) {
        super(target, "div");

        BaseHTML.call(this, "div");

        this.type("CircleHTML");

        this.vars.merge({
            x: 0,
            y: 0,
            r: 20,
        });

        this._.layer.setAttribute("width", `${this.vars.r * 2}px`);
        this._.layer.setAttribute("height", `${this.vars.r * 2}px`);
        this._.nake.setAttribute("border-radius", "50%");

        const r = {
            setAttribute: (key, value) => {
                this._.layer.setAttribute(key, `${value * 2}px`);
            },
        };
        this.vars.watch("r", Factory.action(this, r, "width", Interp.numberInterp));
        this.vars.watch("r", Factory.action(this, r, "height", Interp.numberInterp));
    }
}

CircleHTML.extend(Circle);

Object.assign(CircleHTML.prototype, {
    ...Circle.prototype,
    ...BaseHTML.prototype,
});
