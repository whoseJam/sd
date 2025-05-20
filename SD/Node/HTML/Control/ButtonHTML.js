import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";
import { Color as C } from "@/Utility/Color";

export function ButtonHTML(target) {
    BaseControlHTML.call(this, target, "button");

    this.type("ButtonHTML");

    this.vars.merge({
        width: 60,
        height: 25,
        fill: C.buttonGrey,
        stroke: C.darkButtonGrey,
    });

    this._.layer.setAttribute("width", `${this.vars.width}px`);
    this._.layer.setAttribute("height", `${this.vars.height}px`);
    this._.nake.setAttribute("text", "点击");
}

ButtonHTML.prototype = {
    ...BaseControlHTML.prototype,
    text(value) {
        if (value === undefined) return this._.nake.getAttribute("text");
        this._.nake.setAttribute("text", value);
        return this;
    },
};
