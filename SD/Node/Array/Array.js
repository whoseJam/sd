import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { Box } from "@/Node/Element/Box";
import { Factory } from "@/Utility/Factory";

export function Array(parent) {
    BaseArray.call(this, parent);

    this.type("Array");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40,
    });

    this.effect("array", () => {
        this.vars.elements.forEach((element, id) => {
            this.tryUpdate(element, () => {
                element.x(this.x() + id * this.elementWidth());
                element.y(this.y());
                element.width(this.elementWidth());
                element.height(this.elementHeight());
            });
        });
    });
}

Array.prototype = {
    ...BaseArray.prototype,
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
    width(width) {
        if (width === undefined) return this.elementWidth() * this.length();
        const length = this.length() ? this.length() : 1;
        this.elementWidth(width / length);
        return this;
    },
    insert(id, value) {
        const element = new Box(this.layer("elements")).opacity(0);
        element.value(value);
        element.onEnter(EN.appear("elements"));
        this.insertByBaseArray(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = new Box(this.layer("elements")).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.insertByBaseArray(id, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    insertFromExistElement(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        this.insertByBaseArray(id, element);
        return this;
    },
};

Array.prototype.height = Array.prototype.elementHeight;
