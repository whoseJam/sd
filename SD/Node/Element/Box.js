import { BaseElement } from "@/Node/Element/BaseElement";
import { Rect } from "@/Node/Nake/Rect";
import { Rule as R } from "@/Rule/Rule";

export function Box(parent, value) {
    BaseElement.call(this, parent);

    this.type("Box");

    this.childAs("background", new Rect(this.layer("background")), R.background());

    this.value(value);
}

Box.prototype = {
    ...BaseElement.prototype,
};
