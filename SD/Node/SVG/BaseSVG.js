import { Interp } from "@/Animate/Interp";
import { SD2DNode } from "@/Node/SD2DNode";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseSVG(parent, label) {
    SD2DNode.call(this, parent, undefined, "g");

    this.vars.merge({
        fill: C.black,
        fillOpacity: 1,
        stroke: C.white,
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDashOffset: 0,
        strokeDashArray: [1, 0],
    });

    this._.nake = createRenderNode(this, this._.layer, label);

    this.vars.associate("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
    this.vars.associate("fillOpacity", Factory.action(this, this._.nake, "fill-opacity", Interp.numberInterp));
    this.vars.associate("strokeOpacity", Factory.action(this, this._.nake, "stroke-opacity", Interp.numberInterp));
    this.vars.associate("strokeWidth", Factory.action(this, this._.nake, "stroke-width", Interp.numberInterp));
    this.vars.associate("strokeDashOffset", Factory.action(this, this._.nake, "stroke-dashoffset", Interp.numberInterp));
    this.vars.associate("strokeDashArray", Factory.action(this, this._.nake, "stroke-dasharray", Interp.arrayInterp));

    this._.BASE_NAKE = true;
}

BaseSVG.prototype = {
    ...SD2DNode.prototype,
    BASE_SVG: true,
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    fillOpacity: Factory.handlerMediumPrecise("fillOpacity"),
    strokeOpacity: Factory.handlerMediumPrecise("strokeOpacity"),
    strokeWidth: Factory.handlerMediumPrecise("strokeWidth"),
    strokeDashOffset: Factory.handlerMediumPrecise("strokeDashOffset"),
    strokeDashArray: Factory.handler("strokeDashArray"),
    color(color) {
        if (color === undefined) return { fill: this.fill(), stroke: this.stroke() };
        if (typeof color === "string") {
            this.fill(color);
            if (this.text) this.stroke(color);
            else if (Check.isTypeOfLine(this)) this.stroke(color);
        } else this.fill(color.fill).stroke(color.stroke);
        return this;
    },
};
