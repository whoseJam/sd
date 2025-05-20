import { BaseElement } from "@/Node/Element/BaseElement";
import { Circle } from "@/Node/Shape/Circle";
import { CircleSVG } from "@/Node/SVG/Shape/CircleSVG";
import { Rule as R } from "@/Rule/Rule";
import { Factory } from "@/Utility/Factory";

export function Vertex(target, value) {
    BaseElement.call(this, target);

    this.type("Vertex");

    this.vars.merge({
        r: 20,
    });

    const background = new Circle(this);
    this.childAs("background", background, R.circleBackground());

    this.value(value);
}

Vertex.prototype = {
    ...BaseElement.prototype,
    r: Factory.handlerLowPrecise("r"),
    width: CircleSVG.prototype.width,
    height: CircleSVG.prototype.height,
    inRange: CircleSVG.prototype.inRange,
};
