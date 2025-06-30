import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/Core/Enter";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class ValueArray extends Array {
    constructor(target) {
        super(target);

        this.type("ValueArray");

        Check.validateArgumentsCountEqualTo(arguments, 1, `${this.type()}.constructor`);

        this.vars.merge({
            align: "cy",
        });

        this.uneffect("array");
        this.effect("array", () => {
            const align = this.align();
            this.vars.elements.forEach((element, id) => {
                this.tryUpdate(element, () => {
                    element.cx(this.x() + this.elementWidth() * (id + 0.5));
                    element[align](this[align]());
                });
            });
        });
    }
}

Object.assign(ValueArray.prototype, {
    align: Factory.handler("align"),
    insert(id, value) {
        const element = Cast.castToSDNode(this.layer("elements"), value);
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        this.__insert(id, element);
        return this;
    },
});

ValueArray.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistValue;
