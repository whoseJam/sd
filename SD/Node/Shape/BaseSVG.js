import { Interp } from "@/Animate/Interp";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseSVG(label) {
    this.vars.merge({
        fill: C.white,
        fillOpacity: 1,
        stroke: C.black,
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDashOffset: 0,
        strokeDashArray: [1, 0],
    });

    this._.nake = createRenderNode(this, this._.layer, label);
    this._.nake.setAttribute("fill", this.vars.fill);
    this._.nake.setAttribute("stroke", this.vars.stroke);

    this.vars.watch("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
    this.vars.watch("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
    this.vars.watch("fillOpacity", Factory.action(this, this._.nake, "fill-opacity", Interp.numberInterp));
    this.vars.watch("strokeOpacity", Factory.action(this, this._.nake, "stroke-opacity", Interp.numberInterp));
    this.vars.watch("strokeWidth", Factory.action(this, this._.nake, "stroke-width", Interp.numberInterp));
    this.vars.watch("strokeDashOffset", Factory.action(this, this._.nake, "stroke-dashoffset", Interp.numberInterp));
    this.vars.watch("strokeDashArray", Factory.action(this, this._.nake, "stroke-dasharray", Interp.arrayInterp));
}

Object.assign(BaseSVG.prototype, {
    fill(fill) {
        if (arguments.length === 0) return this.vars.fill;
        Check.validateColor(fill, `${this.constructor.name}.fill`);
        this.vars.fill = fill;
        return this;
    },
    stroke(stroke) {
        if (arguments.length === 0) return this.vars.stroke;
        Check.validateColor(stroke, `${this.constructor.name}.stroke`);
        this.vars.stroke = stroke;
        return this;
    },
    fillOpacity(opacity) {
        if (arguments.length === 0) return this.vars.fillOpacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.fillOpacity`);
        this.vars.fillOpacity = opacity;
        return this;
    },
    strokeOpacity(opacity) {
        if (arguments.length === 0) return this.vars.strokeOpacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.strokeOpacity`);
        this.vars.strokeOpacity = opacity;
        return this;
    },
    strokeWidth(width) {
        if (arguments.length === 0) return this.vars.strokeWidth;
        Check.validateNumber(width, `${this.constructor.name}.strokeWidth`);
        this.vars.strokeWidth = width;
        return this;
    },
    strokeDashOffset(offset) {
        if (arguments.length === 0) return this.vars.strokeDashOffset;
        Check.validateNumber(offset, `${this.constructor.name}.strokeDashOffset`);
        this.vars.strokeDashOffset = offset;
        return this;
    },
    strokeDashArray(array) {
        if (arguments.length === 0) return this.vars.strokeDashArray;
        this.vars.strokeDashArray = array;
        return this;
    },
    color(color) {
        if (arguments.length === 0)
            return {
                fill: this.fill(),
                stroke: this.stroke(),
            };
        Check.validateColor(color);
        if (Check.isString(color)) this.fill(color);
        else this.fill(color.fill).stroke(color.stroke);
        return this;
    },
});
