import * as sd from "@/sd";

const R = sd.rule();

function randomCardColor(m, k) {
    const result = [];
    const lim = m >> 1;
    for (let i = 0; i < lim; i++) {
        const x = sd.rand(1, k);
        result.push(x);
        result.push(x);
    }
    for (let i = 1; i < result.length; i++) {
        const p = sd.rand(0, i - 1);
        [result[p], result[i]] = [result[i], result[p]];
    }
    return result;
}

export class Game extends sd.SD2DNode {
    constructor(target, n, m, k, colors) {
        super(target);
        this._.focusAt = undefined;
        this._.stacks = new sd.ValueArray(this).align("my").elementWidth(60);
        this._.cards = [];
        const cardCallback = () => {
            const focus = this._.focus;
            const card = this.lastCard();
            if (this._.focusAt === undefined) {
                this._.focusAt = { type: "card" };
                sd.inter(async () => {
                    focus.startAnimate().focus(card).endAnimate();
                });
            } else {
                const stack = this._.stacks.element(this._.focusAt.i);
                const card = this._.cards.pop();
                sd.inter(async () => {
                    focus.startAnimate().focus(null).endAnimate();
                    stack.startAnimate().pushFromExistElement(card.onClick(null)).endAnimate();
                    if (
                        stack.length() >= 2 &&
                        stack.lastElement().color().fill === stack.element(stack.end() - 1).color().fill
                    )
                        stack.startAnimate().erase(stack.end()).erase(stack.end()).endAnimate();
                    if (this.lastCard()) this.lastCard().onClick(cardCallback);
                });
                this._.focusAt = undefined;
            }
        };
        const _colors = typeof m === "number" ? randomCardColor(m, k) : m.reverse();
        for (let i = 0; i < _colors.length; i++) {
            const card = new sd.Rect(this).color(colors[_colors[i] - 1]);
            this._.cards.push(card);
            this.childAs(card);
            card.mx(this._.stacks.x()).my(this._.stacks.y() - 50 - i * 2);
        }
        this.lastCard().onClick(cardCallback);
        this.childAs(this._.stacks);
        for (let i = 0; i < n; i++) {
            const stack = new sd.ValuePile(this);
            this._.stacks.push(stack);
            const label = sd
                .Aside(stack, new sd.Box(stack).width(15).height(15), "bc")
                .fillOpacity(0)
                .strokeOpacity(0)
                .value(new sd.Math(stack, `$s_${i + 1}$`), R.center());
            label.onClick(() => {
                const focus = this._.focus;
                if (this._.focusAt === undefined) {
                    this._.focusAt = {
                        type: "stack",
                        i: i,
                    };
                    sd.inter(async () => {
                        focus.startAnimate().focus(label).endAnimate();
                    });
                } else {
                    if (this._.focusAt.type === "stack") {
                        const otherStack = this._.stacks.element(this._.focusAt.i);
                        sd.inter(async () => {
                            focus.startAnimate().focus(null).endAnimate();
                            if (
                                otherStack.length() > 0 &&
                                stack.length() > 0 &&
                                otherStack.firstElement().color().fill === stack.firstElement().color().fill
                            ) {
                                otherStack.startAnimate().erase(0).endAnimate();
                                stack.startAnimate().erase(0).endAnimate();
                            }
                        });
                    } else {
                        const card = this._.cards.pop();
                        sd.inter(async () => {
                            focus.startAnimate().focus(null).endAnimate();
                            stack.startAnimate().pushFromExistElement(card.onClick(null)).endAnimate();
                            if (
                                stack.length() >= 2 &&
                                stack.lastElement().color().fill === stack.element(stack.end() - 1).color().fill
                            )
                                stack.startAnimate().erase(stack.end()).erase(stack.end()).endAnimate();
                            if (this.lastCard()) this.lastCard().onClick(cardCallback);
                        });
                    }
                    this._.focusAt = undefined;
                }
            });
        }
        this._.focus = sd.Focus(this);
    }
    moveTo(stackId) {
        const cardCallback = () => {
            const focus = this._.focus;
            const card = this.lastCard();
            if (this._.focusAt === undefined) {
                this._.focusAt = { type: "card" };
                sd.inter(async () => {
                    focus.startAnimate().focus(card).endAnimate();
                });
            } else {
                const stack = this._.stacks.element(this._.focusAt.i);
                const card = this._.cards.pop();
                sd.inter(async () => {
                    focus.startAnimate().focus(null).endAnimate();
                    stack.startAnimate().pushFromExistElement(card.onClick(null)).endAnimate();
                    if (
                        stack.length() >= 2 &&
                        stack.lastElement().color().fill === stack.element(stack.end() - 1).color().fill
                    )
                        stack.startAnimate().erase(stack.end()).erase(stack.end()).endAnimate();
                    if (this.lastCard()) this.lastCard().onClick(cardCallback);
                });
                this._.focusAt = undefined;
            }
        };
        this._.focus.focus(null);
        this._.focusAt = undefined;
        const card = this._.cards.pop();
        const stack = this._.stacks.element(stackId - 1);
        stack.pushFromExistElement(card.onClick(null));
        if (stack.length() >= 2 && stack.lastElement().color().fill === stack.element(stack.end() - 1).color().fill)
            stack.erase(stack.end()).erase(stack.end());
        if (this.lastCard()) this.lastCard().onClick(cardCallback);
        return this;
    }
    lastCard() {
        return this._.cards[this._.cards.length - 1];
    }
}
