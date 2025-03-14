import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/Core/Enter";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";

export function ValueArray(parent) {
    Array.call(this, parent);

    this.type("ValueArray");

    this.vars.merge({
        align: "cy",
    });

    this.uneffect("array");
    this.effect("valueArray", () => {
        const align = this.align();
        this.vars.elements.forEach((element, id) => {
            this.tryUpdate(element, () => {
                element.cx(this.x() + this.elementWidth() * (id + 0.5));
                element[align](this[align]());
            });
        });
    });
}

ValueArray.prototype = {
    ...Array.prototype,
    align: Factory.handler("align"),
    insert(id, value) {
        const element = Cast.castToSDNode(this.layer("elements"), value);
        element.onEnter(EN.appear("elements"));
        this.insertByBaseArray(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        this.insertByBaseArray(id, element);
        return this;
    },
};

ValueArray.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistValue;
