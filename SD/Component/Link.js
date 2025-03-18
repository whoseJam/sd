import { Context } from "@/Animate/Context";
import { svg } from "@/Interact/Root";
import { Exit as EX } from "@/Node/Core/Exit";
import { Line } from "@/Node/SVG/Line";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";

export function Link(sourceElement, targetElement, type = Line, sourceXLocation = "cx", sourceYLocation = "cy", targetXLocation = "cx", targetYLocation = "cy") {
    const link = new type(svg());
    link.vars.merge({
        element1: sourceElement,
        element2: targetElement,
        xlocation1: sourceXLocation,
        ylocation1: sourceYLocation,
        xlocation2: targetXLocation,
        ylocation2: targetYLocation,
    });
    link.effect("element", () => {
        if (link.vars.update) link.vars.update = false;
        const element1 = link.vars.element1;
        const element2 = link.vars.element2;
        link.source(element1[link.vars.xlocation1](), element1[link.vars.ylocation1]());
        link.target(element2[link.vars.xlocation2](), element2[link.vars.ylocation2]());
    });
    link.effect("trim", () => {
        const element1 = link.vars.element1;
        const element2 = link.vars.element2;
        trim(link, element1, element2);
    });
    link.sourceElement = function (element) {
        if (element === undefined) return this.vars.element1;
        const context = new Context(this);
        this.vars.element1.eraseChild(this.onExit(EX.drop()));
        context.recover();
        this.vars.element1 = element;
        element.childAs(this);
        return this;
    };
    link.targetElement = function (element) {
        if (element === undefined) return this.vars.element2;
        const context = new Context(this);
        this.vars.element2.eraseChild(this.onExit(EX.drop()));
        context.recover();
        this.vars.element2 = element;
        element.childAs(this);
        return this;
    };
    link.sourceXLocation = Factory.handler("xlocation1");
    link.sourceYLocation = Factory.handler("ylocation1");
    link.targetXLocation = Factory.handler("xlocation2");
    link.targetYLocation = Factory.handler("ylocation2");
    sourceElement.childAs(link);
    targetElement.childAs(link);
    return link;
}
