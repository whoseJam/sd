import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";

export function SliderHTML(target) {
    BaseControlHTML.call(this, target, "input");

    this.type("SliderHTML");

    this.vars.merge({
        width: 80,
        height: 20,
    });

    this._.layer.setAttribute("width", `${this.vars.width}px`);
    this._.layer.setAttribute("height", `${this.vars.height}px`);
    this._.nake.setAttribute("type", "range");
    this._.nake.setAttribute("min", 0);
    this._.nake.setAttribute("max", 10);
}

SliderHTML.prototype = {
    ...BaseControlHTML.prototype,
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
