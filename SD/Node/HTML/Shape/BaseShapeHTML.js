import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseShapeHTML(target, label) {
    BaseHTML.call(this, target);

    this.vars.merge({
        fill: C.white,
        stroke: C.black,
        strokeWidth: 1,
    });

    this._.nake = createRenderNode(this, this._.layer, label);
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");
    this._.nake.setAttribute("border-width", `${this.vars.strokeWidth}px`);
    this._.nake.setAttribute("border-style", "solid");
    this._.nake.setAttribute("border-color", this.vars.stroke);
    this._.nake.setAttribute("background-color", this.vars.fill);

    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("fill", Factory.action(this, this._.nake, "background-color", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "border-color", Interp.colorInterp));
}

BaseShapeHTML.prototype = {
    ...BaseHTML.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
};
