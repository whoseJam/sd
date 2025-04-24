import { Axis } from "@/Node/Axis/Axis";
import { Factory } from "@/Utility/Factory";

export function FixGapAxis(parent) {
    Axis.call(this, parent, { gap: 30 });

    this.type("FixGapAxis");

    delete this.vars.length;
}

FixGapAxis.prototype = {
    ...Axis.prototype,
    length(length) {
        if (arguments.length === 0) return this.gap() * (this.tickCount() - 1);
        this.gap(length / (this.tickCount() - 1));
        return this;
    },
    gap: Factory.handlerLowPrecise("gap"),
};
