import * as sd from "@/sd";

const R = sd.rule();
const EN = sd.enter();

export class Timeline extends sd.Array {
    constructor(target, n) {
        super(target);
        this.resize(n).start(1);
    }
    brace(l, r, gap, item, itemGap = 4) {
        const brace = new sd.BraceCurve(this);
        if (item) brace.childAs("item", item, R.pointAtPathByRate(0.5, "cx", "y", 0, itemGap));
        this.childAs(brace, (parent, child) => {
            const e1 = this.element(l);
            const e2 = this.element(r);
            child.target(e1.x(), e1.my() + gap);
            child.source(e2.mx(), e2.my() + gap);
        });
        return this;
    }
}
