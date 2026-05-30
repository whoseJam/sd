import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();

export class ColorCounter extends sd.Array {
    constructor(target, colors) {
        super(target);
        this._.colors = colors;
        for (let i = 0; i < colors.length; i++) {
            // bug report: this.push(new sd.Rect(this).color(colors[i]))
            this.push();
            this.value(i, new sd.Rect(this).color(colors[i]));
        }
        this.forEachElement(element => {
            const stk = new sd.Stack(this).elementWidth(20).elementHeight(20);
            element.childAs("stk", stk, R.aside("bc"));
        });
    }
    addColor(i) {
        const stk = this.element(i).child("stk");
        stk.push().color(stk.end(), this._.colors[i]);
        return this;
    }
    removeColor(i) {
        const stk = this.element(i).child("stk");
        stk.pop();
        return this;
    }
}
