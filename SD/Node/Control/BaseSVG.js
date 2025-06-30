import { Interp } from "@/Animate/Interp";
import { createHtmlNodeOnForeignObject, createRenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseSVG(label) {
    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        fill: C.white,
        stroke: C.black,
        strokeWidth: 1,
    });

    this._.for = createRenderNode(this, this._.layer, "foreignObject");
    this._.for.setAttribute("x", this.vars.x);
    this._.for.setAttribute("y", this.vars.y);
    this._.for.setAttribute("width", this.vars.width);
    this._.for.setAttribute("height", this.vars.height);
    this._.nake = createHtmlNodeOnForeignObject(this, this._.for, label);
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");
    this._.nake.setAttribute("border-style", "solid");
    this._.nake.setAttribute("border-width", `${this.vars.strokeWidth}px`);
    this._.nake.setAttribute("border-color", this.vars.stroke);
    this._.nake.setAttribute("background-color", this.vars.fill);

    this.vars.watch("x", Factory.action(this, this._.for, "x", Interp.numberInterp));
    this.vars.watch("y", Factory.action(this, this._.for, "y", Interp.numberInterp));
    this.vars.watch("width", Factory.action(this, this._.for, "width", Interp.numberInterp));
    this.vars.watch("height", Factory.action(this, this._.for, "height", Interp.numberInterp));
    this.vars.watch("fill", Factory.action(this, this._.nake, "background-color", Interp.colorInterp));
    this.vars.watch("stroke", Factory.action(this, this._.nake, "border-color", Interp.colorInterp));
}

Object.assign(BaseSVG.prototype, {
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.type()}.x`);
        this.vars.lpset("x", x);
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.type()}.y`);
        this.vars.lpset("y", y);
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    },
    fill(fill) {
        if (arguments.length === 0) return this.vars.fill;
        Check.validateColor(fill, `${this.type()}.fill`);
        this.vars.lpset("fill", fill);
        return this;
    },
    stroke(stroke) {
        if (arguments.length === 0) return this.vars.stroke;
        Check.validateColor(stroke, `${this.type()}.stroke`);
        this.vars.lpset("stroke", stroke);
        return this;
    },
});
