import { Axis } from "@/Node/Axis/Axis";
import { Factory } from "@/Utility/Factory";

export class FixGapAxis extends Axis {
    constructor(target) {
        super(target, { gap: 30 });

        this.type("FixGapAxis");

        delete this.vars.length;
    }
}

Object.assign(FixGapAxis.prototype, {
    length(length) {
        if (arguments.length === 0) return this.gap() * (this.tickCount() - 1);
        this.gap(length / (this.tickCount() - 1));
        return this;
    },
    gap: Factory.handlerLowPrecise("gap"),
});
