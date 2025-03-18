import { BaseElement } from "@/Node/Element/BaseElement";
import { Circle } from "@/Node/SVG/Circle";
import { Rule as R } from "@/Rule/Rule";
import { Factory } from "@/Utility/Factory";

export function Vertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("Vertex");

    this.vars.merge({
        r: 20,
    });

    this.childAs("background", new Circle(this.layer("background")), R.circleBackground());

    this.value(value);
}

Vertex.prototype = {
    ...BaseElement.prototype,
    r: Factory.handlerLowPrecise("r"),
    width: Circle.prototype.width,
    height: Circle.prototype.height,
    inRange: Circle.prototype.inRange,
};
