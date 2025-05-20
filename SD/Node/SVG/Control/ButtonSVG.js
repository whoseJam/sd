import { BaseControlSVG } from "@/Node/SVG/Control/BaseControlSVG";
import { createHtmlNodeOnForeignObject } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";

export function ButtonSVG(target) {
    BaseControlSVG.call(this, target);

    this.type("ButtonSVG");

    this.vars.merge({
        width: 60,
        height: 25,
        fill: C.buttonGrey,
        stroke: C.darkButtonGrey,
    });

    this._.foreign.setAttribute("width", this.vars.width);
    this._.foreign.setAttribute("height", this.vars.height);
    this._.control = createHtmlNodeOnForeignObject(this, this._.foreign, "button");
    this._.control.setAttribute("text", "点击");
    this._.control.setAttribute("width", "100%");
    this._.control.setAttribute("height", "100%");
}

ButtonSVG.prototype = {
    ...BaseControlSVG.prototype,
};
