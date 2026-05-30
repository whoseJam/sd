import * as sd from "@/sd";

const R = sd.rule();

function convertTag(target, tag) {
    if (typeof tag === "number" || typeof tag === "string") {
        if (tag.startsWith("$")) tag = new sd.Math(target, tag);
        else tag = new sd.Text(target, tag);
    }
    return tag;
}

export class TagAnalyzer extends sd.ValueTree {
    /**
     * @param {sd.SDNode|sd.RenderNode} target
     * @param {number} n
     * @param {string | null} sum
     * @param {string | null} tag
     */
    constructor(target, n, sum, tag) {
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
        if (sum !== null && sum !== undefined) {
            const brace = sd.Brace(this.element(1)).brace(1, n).value(sum);
            this._.sum = brace.value();
        }
        this.element(1).childAs("tag", convertTag(this, tag), R.aside("rc"));
        this._.tag = this.element(1).child("tag");
    }
    sum() {
        return this._.sum;
    }
    tag() {
        return this._.tag;
    }
}
