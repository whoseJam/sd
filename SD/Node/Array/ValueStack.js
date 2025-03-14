import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { Factory } from "@/Utility/Factory";

export function ValueStack(parent) {
    Stack.call(this, parent);

    this.type("ValueStack");

    this.vars.merge({
        align: "cx",
    });

    this.uneffect("stack");
    this.effect("valueStack", () => {
        const align = this.align();
        this.vars.elements.forEach((element, i) => {
            this.tryUpdate(element, () => {
                element.cy(this.y() + this.elementHeight() * (i + 0.5));
                element[align](this[align]());
            });
        });
    });
}

ValueStack.prototype = {
    ...Stack.prototype,
    align: Factory.handler("align"),
    insert: ValueArray.prototype.insert,
    insertFromExistValue: ValueArray.prototype.insertFromExistValue,
    insertFromExistElement: ValueArray.prototype.insertFromExistElement,
};
