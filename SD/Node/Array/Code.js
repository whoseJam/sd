import { Context } from "@/Animate/Context";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { RectSVG } from "@/Node/Shape/RectSVG";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Color } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

function focusRule(parent, child) {
    if (typeof parent.l() !== "number") return;
    const l = parent.element(parent.l());
    const r = parent.element(parent.r());
    child.x(l.x()).y(l.y());
    child.width(parent.width());
    child.height(r.my() - l.y());
}

export class Code extends BaseArray {
    constructor(target, source) {
        super(target);

        this.type("Code");

        this.vars.merge({
            l: undefined,
            r: undefined,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            fontSize: 20,
            start: 1,
        });

        this.effect("code", () => {
            const x = this.x();
            let y = this.y();
            let width = 0;
            let height = 0;
            const fontSize = this.fontSize();
            const elements = this.vars.elements;
            for (let element of elements) {
                this.tryUpdate(element, () => {
                    element.fontSize(fontSize);
                    element.x(x).y(y);
                    y += element.height();
                    width = Math.max(width, element.width());
                    height += element.height();
                });
            }
            this.vars.width = width;
            this.vars.height = height;
        });

        this.childAs(
            "focus",
            new RectSVG(this)
                .color(Color.BLUE)
                .opacity(0)
                .onEnter(() => {}),
            focusRule
        );

        this.newLayer("elements");

        if (source) this.code(source);
    }
}

Object.assign(Code.prototype, {
    fontSize: Factory.handler("fontSize"),
    width(width) {
        if (width === undefined) return this.vars.width;
        const k = width / this.vars.width;
        this.fontSize(this.fontSize() * k);
        return this;
    },
    height(height) {
        if (height === undefined) return this.vars.height;
        const k = height / this.vars.height;
        this.fontSize(this.fontSize() * k);
        return this;
    },
    insert(id, value = "") {
        const element = Cast.castToSDNode(this.layer("elements"), value);
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        return this;
    },
    code(source) {
        for (let i = this.end(); i >= this.start(); i--) this.erase(i);
        let ans = "";
        for (let i = 0; i < source.length; i++) {
            if (source[i] === "\n") {
                if (ans != "") this.push(ans);
                ans = "";
            } else ans += source[i];
        }
        if (ans.length > 0) this.push(ans);
        return this;
    },
    focus(l, r) {
        const focus = this.child("focus");
        if (Check.isFalse(l)) {
            this.freeze();
            this.vars.l = undefined;
            this.vars.r = undefined;
            this.unfreeze();
            focus.opacity(0);
            return this;
        } else if (arguments.length === 1) return this.focus(l, l);
        if (focus.opacity() === 0) {
            const context = new Context(focus);
            focus.startAnimate(context.tillc(0, 0));
            this.freeze();
            this.vars.l = l;
            this.vars.r = r;
            this.unfreeze();
            focus.startAnimate(context.tillc(0, 1));
            focus.opacity(1);
        } else {
            this.freeze();
            this.vars.l = l;
            this.vars.r = r;
            this.unfreeze();
        }
        return this;
    },
    l() {
        return this.vars.l;
    },
    r() {
        return this.vars.r;
    },
    value() {
        return this.element.apply(this, arguments);
    },
});
