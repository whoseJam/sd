import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class Stack extends BaseArray {
    constructor(target) {
        super(target);

        this.type("Stack");

        Check.validateArgumentsCountEqualTo(arguments, 1, `${this.type()}.constructor`);

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
        });

        this.effect("array", () => {
            this.vars.elements.forEach((element, id) => {
                this.tryUpdate(element, () => {
                    element.width(this.elementWidth());
                    element.height(this.elementHeight());
                    element.x(this.x());
                    element.y(this.y() + id * this.elementHeight());
                });
            });
        });
    }
}

Object.assign(Stack.prototype, {
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
});

Stack.prototype.width = Stack.prototype.elementWidth;
