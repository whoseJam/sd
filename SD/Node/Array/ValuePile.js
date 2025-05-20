import { Pile } from "@/Node/Array/Pile";
import { Factory } from "@/Utility/Factory";

export function ValuePile(target) {
    Pile.call(this, target);

    this.type("ValuePile");

    this.vars.merge({
        align: "cx",
    });

    this.uneffect("pile");
    this.effect("valuePile", () => {
        const align = this.align();
        this.vars.elements.forEach((element, i) => {
            this.tryUpdate(element, () => {
                element.cy(this.my() - this.elementHeight() * (i + 0.5));
                element[align](this[align]());
            });
        });
    });
}

ValuePile.prototype = {
    ...Pile.prototype,
    align: Factory.handler("align"),
};
