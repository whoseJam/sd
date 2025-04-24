import { Context } from "@/Animate/Context";
import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { Rule as R } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

function labelRule(parent, child) {
    const gap = parent.valueGap();
    const location = parent.location();
    if (location === "t") R.pointAtPathByRate(0.5, "cx", "my", 0, -gap)(parent, child);
    if (location === "b") R.pointAtPathByRate(0.5, "cx", "y", 0, gap)(parent, child);
    if (location === "l") R.pointAtPathByRate(0.5, "mx", "cy", -gap, 0)(parent, child);
    if (location === "r") R.pointAtPathByRate(0.5, "x", "cy", gap, 0)(parent, child);
}

function replaceBrace(brace, l, r) {
    if (brace.vars.element1) brace.vars.element1.eraseChild(brace);
    if (brace.vars.element2) brace.vars.element2.eraseChild(brace);
    l.childAs(brace);
    r.childAs(brace);
}

export function Brace(parent, location) {
    const brace = new BraceCurve(parent).opacity(0);
    brace.vars.merge({
        element1: undefined,
        element2: undefined,
        location: location || "t",
        braceGap: 5,
        valueGap: 5,
    });
    brace.location = Factory.handler("location");
    brace.braceGap = Factory.handlerLowPrecise("braceGap");
    brace.valueGap = Factory.handlerLowPrecise("valueGap");
    brace.brace = function (l, r, location, gap) {
        if (!Check.isTypeOfSDNode(l)) l = parent.element(l);
        if (!Check.isTypeOfSDNode(r)) r = parent.element(r);
        if (!Check.isFalseType(location)) this.location(location);
        if (!Check.isFalseType(gap)) this.braceGap(gap);
        if (!parent.childAs) replaceBrace(this, l, r);
        this.freeze();
        [this.vars.element1, this.vars.element2] = [l, r];
        if (this.opacity() === 0 && this.duration() > 0) {
            const context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
            this.unfreeze();
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        } else {
            if (this.opacity() === 0) this.opacity(1);
            this.unfreeze();
        }
        return this;
    };
    brace.effect("brace", () => {
        const element1 = brace.vars.element1;
        const element2 = brace.vars.element2;
        if (!element1 || !element2) return;
        const gap = brace.braceGap();
        const location = brace.location();
        if (location === "b" || location === "t") {
            const minx = Math.min(element1.x(), element2.x());
            const maxx = Math.max(element1.mx(), element2.mx());
            if (location === "b") {
                const maxy = Math.max(element1.my(), element2.my()) + gap;
                brace.source(maxx, maxy);
                brace.target(minx, maxy);
            } else {
                const miny = Math.min(element1.y(), element2.y()) - gap;
                brace.source(minx, miny);
                brace.target(maxx, miny);
            }
        } else if (location === "l" || location === "r") {
            const miny = Math.min(element1.y(), element2.y());
            const maxy = Math.max(element1.my(), element2.my());
            if (location === "l") {
                const minx = Math.min(element1.x(), element2.x()) - gap;
                brace.source(minx, maxy);
                brace.target(minx, miny);
            } else {
                const maxx = Math.max(element1.mx(), element2.mx()) + gap;
                brace.source(maxx, miny);
                brace.target(maxx, maxy);
            }
        }
    });
    brace.value = function (value) {
        if (value === undefined) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        const element = Cast.castToSDNode(this, value);
        element.onEnter(EN.appear());
        element.onExitDefault(EX.fade());
        this.childAs("value", element, labelRule);
        return this;
    };
    if (Check.isTypeOfSDNode(parent)) parent.childAs(brace);
    return brace;
}
