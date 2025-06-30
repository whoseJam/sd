import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class ValueStack extends Stack {
    constructor(target) {
        super(target);

        this.type("ValueStack");

        Check.validateArgumentsCountEqualTo(arguments, 1, `${this.type()}.constructor`);

        this.vars.merge({
            align: "cx",
        });

        this.uneffect("array");
        this.effect("array", () => {
            const align = this.align();
            this.vars.elements.forEach((element, i) => {
                this.tryUpdate(element, () => {
                    element.cy(this.y() + this.elementHeight() * (i + 0.5));
                    element[align](this[align]());
                });
            });
        });
    }
}

Object.assign(ValueStack.prototype, {
    align: Factory.handler("align"),
    insert: ValueArray.prototype.insert,
    insertFromExistValue: ValueArray.prototype.insertFromExistValue,
    insertFromExistElement: ValueArray.prototype.insertFromExistElement,
});
