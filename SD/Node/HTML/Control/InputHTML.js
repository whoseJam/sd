import { Interp } from "@/Animate/Interp";
import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";

export function InputHTML(target) {
    BaseControlHTML.call(this, target, "input");

    this.type("InputHTML");

    this.vars.merge({
        width: 120,
        height: 25,
        label: "",
    });

    this._.layer.setAttribute("width", `${this.vars.width}px`);
    this._.layer.setAttribute("height", `${this.vars.height}px`);
    this._.layer.setAttribute("display", "flex");
    this._.label = createRenderNode(this, this._.layer, "label");
    this._.label.setAttribute("flex-shrink", 0);
    this._.label.setAttribute("height", "100%");
    this._.label.setAttribute("white-space", "nowrap");
    this._.nake.setAttribute("flex-grow", 1);
    this._.nake.setAttribute("type", "text");
    this._.nake.setAttribute("value", "");

    this.vars.associate("label", Factory.action(this, this._.label, "text", Interp.stringInterp));
}

InputHTML.prototype = {
    ...BaseControlHTML.prototype,
    label: Factory.handler("label"),
    value(value) {
        if (value === undefined) return this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
};
