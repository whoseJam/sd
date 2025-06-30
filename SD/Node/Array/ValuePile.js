import { Pile } from "@/Node/Array/Pile";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class ValuePile extends Pile {
    constructor(target) {
        super(target);

        this.type("ValuePile");

        Check.validateArgumentsCountEqualTo(arguments, 1, `${this.type()}.constructor`);

        this.vars.merge({
            align: "cx",
        });

        this.uneffect("array");
        this.effect("array", () => {
            const align = this.align();
            this.vars.elements.forEach((element, i) => {
                this.tryUpdate(element, () => {
                    element.cy(this.my() - this.elementHeight() * (i + 0.5));
                    element[align](this[align]());
                });
            });
        });
    }
}

Object.assign(ValuePile.prototype, {
    align: Factory.handler("align"),
});
