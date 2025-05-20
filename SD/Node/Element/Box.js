import { BaseElement } from "@/Node/Element/BaseElement";
import { Rect } from "@/Node/Shape/Rect";
import { Rule as R } from "@/Rule/Rule";

export function Box(target, value) {
    BaseElement.call(this, target);

    this.type("Box");

    const background = new Rect(this);
    this.childAs("background", background, R.background());

    this.value(value);
}

Box.prototype = {
    ...BaseElement.prototype,
};
