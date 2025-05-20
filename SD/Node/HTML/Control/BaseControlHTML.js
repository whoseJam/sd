import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseControlHTML(target, label) {
    BaseHTML.call(this, target);

    this.vars.merge({
        x: 0,
        y: 0,
        fill: C.white,
        stroke: C.black,
    });

    this._.nake = createRenderNode(this, this._.layer, label);
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");

    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
    this.vars.associate("fill", Factory.action(this, this._.nake, "background-color", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "border-color", Interp.colorInterp));
}

BaseControlHTML.prototype = {
    ...BaseHTML.prototype,
    BASE_CONTROL: true,
    BASE_CONTROL_HTML: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    color: BaseSVG.prototype.color,
    control() {
        return this._.nake;
    },
};
