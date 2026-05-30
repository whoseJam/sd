import * as sd from "@/sd";

const R = sd.rule();

export class ColorExceedCounter extends sd.Array {
    constructor(target, colors, maxCount) {
        super(target);
        this.resize(colors.length);
        this._.colors = colors;
        this._.sum = new sd.Array(this).resize(maxCount).start(1);
        this.childAs(this._.sum, (parent, child) => {
            child.cx(parent.cx());
            child.y(parent.my() + 30);
        });
        this.forEachElement((element, i) => {
            element.childAs(new sd.Rect(element).width(20).height(20).color(colors[i]), R.aside("tc"));
        });
        sd.Index(this._.sum, "t");
    }
    addColor(i) {
        const nv = this.intValue(i) + 1;
        this.value(i, nv);
        this._.sum.value(nv, this._.sum.intValue(nv) + 1);
        return this;
    }
    removeColor(i) {
        const ov = this.intValue(i);
        this.value(i, ov - 1);
        this._.sum.value(ov, this._.sum.intValue(ov) - 1);
        return this;
    }
}
