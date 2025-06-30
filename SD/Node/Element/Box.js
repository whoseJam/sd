import { BaseElement } from "@/Node/Element/BaseElement";
import { Rect } from "@/Node/Shape/Rect";
import { Rule as R } from "@/Rule/Rule";

export class Box extends BaseElement {
    constructor(target, value) {
        super(target);

        this.type("Box");

        const background = new Rect(this);
        this.childAs("background", background, R.background());

        this.value(value);
    }
}
