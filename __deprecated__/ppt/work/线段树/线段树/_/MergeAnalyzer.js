import * as sd from "@/sd";

export class MergeAnalyzer extends sd.ValueTree {
    constructor(target, n, data) {
        super(target);
        this.width(400).layerHeight(80);
        const makeArray = (l, r) => {
            const array = new sd.Array(this);
            array.resize(r - l + 1).start(l);
            return array;
        };
        const mid = (1 + n) >> 1;
        this.newNode(1, makeArray(1, n));
        this.newNode(2, makeArray(1, mid));
        this.newNode(3, makeArray(mid + 1, n));
        this.link(1, 2);
        this.link(1, 3);
        for (let i = 1; i <= mid; i++) this.element(2).value(i, data[i]);
        for (let i = mid + 1; i <= n; i++) this.element(3).value(i, data[i]);
    }
}

export async function mergeText(analyzer) {
    const root = analyzer.element(1);
    const lchild = analyzer.element(2);
    const rchild = analyzer.element(3);
    for (let i = lchild.start(); i <= lchild.end(); i++) {
        const text = lchild.value(i);
        const text_ = new sd.Text(root, text.text()).fontSize(text.fontSize()).center(text.center());
        root.element(i).valueFromExist(text_);
    }
    for (let i = rchild.start(); i <= rchild.end(); i++) {
        const text = rchild.value(i);
        const text_ = new sd.Text(root, text.text()).fontSize(text.fontSize()).center(text.center());
        root.element(i).valueFromExist(text_);
    }
}
