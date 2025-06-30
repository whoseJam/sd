import { BaseElement } from "@/Node/Element/BaseElement";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Rule as R } from "@/Rule/Rule";

export class EllipseVertex extends BaseElement {
    constructor(target, value) {
        super(target);

        this.type("EllipseVertex");

        const background = new Ellipse(this);
        this.childAs("background", background, R.background());

        this.value(value);
    }
}
