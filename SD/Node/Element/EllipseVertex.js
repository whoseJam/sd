import { BaseElement } from "@/Node/Element/BaseElement";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { Rule as R } from "@/Rule/Rule";

export function EllipseVertex(target, value) {
    BaseElement.call(this, target);

    this.type("EllipseVertex");

    const background = new Ellipse(this);
    this.childAs("background", background, R.background());

    this.value(value);
}

EllipseVertex.prototype = {
    ...BaseElement.prototype,
};
