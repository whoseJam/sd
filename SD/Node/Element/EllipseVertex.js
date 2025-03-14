import { BaseElement } from "@/Node/Element/BaseElement";
import { Ellipse } from "@/Node/Nake/Ellipse";
import { Rule as R } from "@/Rule/Rule";

export function EllipseVertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("EllipseVertex");

    this.childAs("background", new Ellipse(this.layer("background")), R.background());

    this.value(value);
}

EllipseVertex.prototype = {
    ...BaseElement.prototype,
};
