import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";

export function TextAreaHTML(target) {
    BaseControlHTML.call(this, target, "textarea");

    this.vars.merge({
        width: 80,
        height: 100,
    });

    this._.layer.setAttribute("width", `${this.vars.width}px`);
    this._.layer.setAttribute("height", `${this.vars.height}px`);
    this._.nake.setAttribute("value", "");
}

TextAreaHTML.prototype = {
    ...BaseControlHTML.prototype,
    value(value) {
        if (value === undefined) return this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
};
