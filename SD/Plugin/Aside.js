import { Rule as R } from "@/Rule/Rule";
import { Factory } from "@/Utility/Factory";

export function Aside(parent, aside, location = "lc", gap = 5) {
    aside.vars.merge({
        location,
        gap,
    });
    aside.location = Factory.handler("location");
    aside.gap = Factory.handlerLowPrecise("gap");
    parent.childAs(aside, function (parent, child) {
        const rule = R.aside(child.vars.location, child.vars.gap);
        rule(parent, child);
    });
    return aside;
}
