import * as sd from "@/sd";

const R = sd.rule();
const C = sd.color();

export class DepthCounter extends sd.Array {
    constructor(target, maxDepth) {
        super(target);
        this.resize(maxDepth).start(1);
        this.forEachElement(element => {
            const stk = new sd.Stack(this).elementWidth(20).elementHeight(20);
            element.childAs("stk", stk, R.aside("bc"));
        });
        sd.Index(this, "t");
    }
    addNode(i) {
        const stk = this.element(i).child("stk");
        stk.push().color(stk.end(), C.BLUE);
        return this;
    }
    removeNode(i) {
        const stk = this.element(i).child("stk");
        stk.pop();
        return this;
    }
}
