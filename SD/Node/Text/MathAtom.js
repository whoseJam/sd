import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function MathAtom(parent, nake) {
    SDNode.call(this, parent, nake);

    this.vars.merge({
        stroke: C.black,
        fill: C.black,
    });

    this._.layer = nake;
    this._.nake = nake;
    this._.ready = true;

    this.vars.associate("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
}

MathAtom.prototype = {
    ...SDNode.prototype,
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    color: function (color) {
        if (color === undefined) return { main: this.fill(), border: this.stroke() };
        if (typeof color === "string") this.fill(color);
        else this.fill(color.main).stroke(color.border);
        return this;
    },
};
