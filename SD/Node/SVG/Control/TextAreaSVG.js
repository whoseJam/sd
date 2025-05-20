import { BaseControlSVG } from "@/Node/SVG/Control/BaseControlSVG";

export function TextAreaSVG(target) {
    BaseControlSVG.call(this, target);

    this.vars.merge({
        width: 80,
        height: 100,
    });

    this._.foreign.setAttribute("width", this.vars.width);
    this._.foreign.setAttribute("height", this.vars.height);
    this._.control = createHtmlNodeOnForeignObject(this, this._.foreign, "textarea");
    this._.control.setAttribute("width", "100%");
    this._.control.setAttribute("height", "100%");
    this._.control.setAttribute("value", "");
}

TextAreaSVG.prototype = {
    ...BaseControlSVG.prototype,
    value(value) {
        if (value === undefined) return this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
};
