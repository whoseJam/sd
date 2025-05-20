import { Interp } from "@/Animate/Interp";
import { BaseControlSVG } from "@/Node/SVG/Control/BaseControlSVG";
import { createHtmlNodeOnForeignObject, createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";

export function InputSVG(target) {
    BaseControlSVG.call(this, target);

    this.type("InputHTML");

    this.vars.merge({
        width: 120,
        height: 25,
        label: "",
    });

    this._.foreign.setAttribute("width", this.vars.width);
    this._.foreign.setAttribute("height", this.vars.height);
    this._.div = createHtmlNodeOnForeignObject(this, this._.foreign, "div");
    this._.div.setAttribute("display", "flex");
    this._.label = createRenderNode(this, this._.div, "label");
    this._.label.setAttribute("flex-shrink", 0);
    this._.label.setAttribute("height", "100%");
    this._.label.setAttribute("white-space", "nowrap");
    this._.control = createRenderNode(this, this._.div, "input");
    this._.control.setAttribute("flex-grow", 1);
    this._.control.setAttribute("type", "text");
    this._.control.setAttribute("value", "");

    this.vars.associate("label", Factory.action(this, this._.label, "text", Interp.stringInterp));
}

InputSVG.prototype = {
    ...BaseControlSVG.prototype,
    label: Factory.handler("label"),
    value(value) {
        if (value === undefined) return this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
};
