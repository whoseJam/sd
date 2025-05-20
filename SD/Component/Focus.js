import { Context } from "@/Animate/Context";
import { RectSVG } from "@/Node/SVG/Shape/RectSVG";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function Focus(parent) {
    const focus = new RectSVG(parent).opacity(0).fillOpacity(0).stroke(C.red).strokeWidth(3);
    focus.vars.merge({
        element1: undefined,
        element2: undefined,
        rate: undefined,
        gap: undefined,
    });
    focus.gap = Factory.handlerLowPrecise("gap");
    focus.rate = Factory.handlerMediumPrecise("rate");
    focus.focus = function (a, b, c, d) {
        if (arguments.length === 0) return this.focus(parent, parent);
        else if (arguments.length === 1) {
            if (Check.isFalseType(a)) return this.focus(undefined, undefined);
            if (Check.isTypeOfSDNode(a)) return this.focus(a, a);
            return this.focus(parent.element(a), parent.element(a));
        } else if (arguments.length === 2) {
            const dontNeedIndex = (Check.isTypeOfSDNode(a) || Check.isFalseType(a)) && (Check.isTypeOfSDNode(b) || Check.isFalseType(b));
            if (!dontNeedIndex) {
                if (Check.isTypeOfGrid(parent)) return this.focus(parent.element(a, b), parent.element(a, b));
                if (!Check.isTypeOfSDNode(a)) a = parent.element(a);
                if (!Check.isTypeOfSDNode(b)) b = parent.element(b);
                return this.focus(a, b);
            }
        } else if (arguments.length === 4) {
            return this.focus(parent.element(a, b), parent.element(c, d));
        } else {
            ErrorLauncher.invalidArguments();
        }
        this.freeze();
        [this.vars.element1, this.vars.element2] = [a, b];
        if (Check.isFalseType(a)) {
            this.unfreeze().opacity(0);
            return this;
        }
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
    focus.effect("focus", () => {
        const element1 = focus.vars.element1;
        const element2 = focus.vars.element2;
        if (!element1 || !element2) return;
        const x = Math.min(element1.x(), element2.x());
        const mx = Math.max(element1.mx(), element2.mx());
        const y = Math.min(element1.y(), element2.y());
        const my = Math.max(element1.my(), element2.my());
        if (focus.rate() !== undefined) {
            const rate = focus.rate();
            focus.x(x - (mx - x) * (rate - 0.5)).y(y - (my - y) * (rate - 0.5));
            focus.width((mx - x) * rate);
            focus.height((my - y) * rate);
        } else if (focus.gap() !== undefined) {
            const gap = focus.gap();
            focus.x(x - gap).y(y - gap);
            focus.width(mx - x + gap * 2);
            focus.height(my - y + gap * 2);
        } else {
            focus.x(x).y(y);
            focus.width(mx - x);
            focus.height(my - y);
        }
    });
    if (parent.childAs) parent.childAs(focus);
    return focus;
}
