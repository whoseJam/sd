import { Enter as EN } from "@/Node/Core/Enter";
import { BaseElement } from "@/Node/Element/BaseElement";
import { Rect } from "@/Node/SVG/Rect";
import { Rule as R } from "@/Rule/Rule";

export function Box(parent, value) {
    BaseElement.call(this, parent);

    this.type("Box");

    const background = new Rect(this.layer("background")).onEnter(EN.appear("background"));
    this.childAs("background", background, R.background());

    this.value(value);
}

Box.prototype = {
    ...BaseElement.prototype,
};
