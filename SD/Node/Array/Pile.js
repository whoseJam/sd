import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Factory } from "@/Utility/Factory";

export function Pile(target) {
    BaseArray.call(this, target);

    this.type("Pile");

    this.vars.merge({
        x: 0,
        my: 0,
        elementWidth: 40,
        elementHeight: 40,
    });

    this.effect("pile", () => {
        this.vars.elements.forEach((element, i) => {
            this.tryUpdate(element, () => {
                element.width(this.elementWidth());
                element.height(this.elementHeight());
                element.x(this.x());
                element.y(this.my() - (i + 1) * this.elementHeight());
            });
        });
    });
}

Pile.prototype = {
    ...BaseArray.prototype,
    y(y) {
        if (y === undefined) return this.my() - this.height();
        this.my(y + this.height());
        return this;
    },
    my: Factory.handlerLowPrecise("my"),
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
    insert: Array.prototype.insert,
    insertFromExistValue: Array.prototype.insertFromExistValue,
    insertFromExistElement: Array.prototype.insertFromExistElement,
    height(height) {
        if (height === undefined) return this.elementHeight() * this.length();
        const length = Math.max(this.length(), 1);
        this.elementHeight(height / length);
        return this;
    },
};

Pile.prototype.width = Pile.prototype.elementWidth;
