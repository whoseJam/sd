import { Interp } from "@/Animate/Interp";
import { SD2DNode } from "@/Node/SD2DNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class MathAtom extends SD2DNode {
    constructor(target) {
        super(target);

        this.vars.merge({
            stroke: C.black,
            fill: C.black,
        });

        this.vars.watch("fill", Factory.action(this, "math", "fill", Interp.colorInterp));
        this.vars.watch("stroke", Factory.action(this, "math", "stroke", Interp.colorInterp));
    }
}

Object.assign(MathAtom.prototype, {
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    color(color) {
        if (color === undefined) return { fill: this.fill(), stroke: this.stroke() };
        if (typeof color === "string") this.fill(color);
        else this.fill(color.fill).stroke(color.stroke);
        return this;
    },
});
