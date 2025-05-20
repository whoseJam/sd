import { BaseControlSVG } from "@/Node/SVG/Control/BaseControlSVG";
import { createHtmlNodeOnForeignObject } from "@/Renderer/RenderNode";

export function SliderSVG(target) {
    BaseControlSVG.call(this, target);

    this.type("SliderSVG");

    this.vars.merge({
        width: 80,
        height: 20,
    });

    this._.foreign.setAttribute("width", this.vars.width);
    this._.foreign.setAttribute("height", this.vars.height);
    this._.control = createHtmlNodeOnForeignObject(this, this._.foreign, "input");
    this._.control.setAttribute("width", "100%");
    this._.control.setAttribute("height", "100%");
    this._.control.setAttribute("type", "range");
    this._.control.setAttribute("min", 0);
    this._.control.setAttribute("max", 10);
}

SliderSVG.prototype = {
    ...BaseControlSVG.prototype,
    max(value) {
        if (value === undefined) return +this._.nake.getAttribute("max");
        this._.nake.setAttribute("max", value);
        return this;
    },
    min(value) {
        if (value === undefined) return +this._.nake.getAttribute("min");
        this._.nake.setAttribute("min", value);
        return this;
    },
    value(value) {
        if (value === undefined) return +this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
};
