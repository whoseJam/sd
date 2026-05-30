import * as sd from "@/sd";

const R = sd.rule();
const lc = x => x * 2;
const rc = x => x * 2 + 1;

export class SegmentTree extends sd.ValueTree {
    constructor(target, l, r) {
        super(target);
        this.layerHeight(80).width(800);
        const makeArray = (l, r) => {
            const array = new sd.Array(this);
            array.resize(r - l + 1).start(l);
            return array;
        };
        const build = (x, l, r) => {
            this.newNode(x, makeArray(l, r));
            if (l === r) return;
            const mid = (l + r) >> 1;
            build(lc(x), l, mid);
            build(rc(x), mid + 1, r);
            this.link(x, lc(x));
            this.link(x, rc(x));
        };
        this.freeze();
        build(1, l, r);
        this.unfreeze();
        this._.l = l;
        this._.r = r;
    }
}
/**
 *
 * @param {SegmentTree} tree
 * @param {number} pos
 * @param {{
 *  onEnter: (x: number, l: number, r: number, pos: number) => void | Promise<any>;
 *  onExit: (x: number, l: number, r: number, pos: number) => void | Promise<any>;
 *  onSelect: (x: number, l: number, r: number, pos: number) => void | Promise<any>;
 * }} args
 */
export async function pointSelect(tree, pos, args) {
    const onEnter = args.onEnter;
    const onExit = args.onExit;
    const onSelect = args.onSelect;
    const dfs = async (x, l, r) => {
        if (onEnter) await onEnter(x, l, r, pos);
        if (l === r) {
            if (onSelect) await onSelect(x, l, r, pos);
            return;
        }
        const mid = (l + r) >> 1;
        if (pos <= mid) await dfs(lc(x), l, mid);
        else await dfs(rc(x), mid + 1, r);
        if (onExit) await onExit(x, l, r, pos);
    };
    await dfs(1, tree._.l, tree._.r);
}

/**
 * @param {SegmentTree} tree
 * @param {number} ql
 * @param {number} qr
 * @param {{
 *  onEnter: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 *  onExit: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 *  onPushDown: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 *  onSelect: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 * }} args
 */
export async function rangeSelect(tree, ql, qr, args) {
    const onEnter = args.onEnter;
    const onExit = args.onExit;
    const onPushDown = args.onPushDown;
    const onSelect = args.onSelect;
    const dfs = async (x, l, r) => {
        if (onEnter) await onEnter(x, l, r, ql, qr);
        if (ql <= l && r <= qr) {
            if (onSelect) await onSelect(x, l, r, ql, qr);
            return;
        }
        if (onPushDown) await onPushDown(x, l, r, ql, qr);
        const mid = (l + r) >> 1;
        if (ql <= mid) await dfs(lc(x), l, mid);
        if (qr > mid) await dfs(rc(x), mid + 1, r);
        if (onExit) await onExit(x, l, r, ql, qr);
    };
    await dfs(1, tree._.l, tree._.r);
}

/**
 * @param {SegmentTree} tree
 * @param {number} ql
 * @param {number} qr
 * @param {{
 *  onEnter: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 *  onExit: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 *  onSelect: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 *  onFail: (x: number, l: number, r: number, ql: number, qr: number) => void | Promise<any>;
 * }} args
 */
export async function rangeSelectNaive(tree, ql, qr, args) {
    const onEnter = args.onEnter;
    const onExit = args.onExit;
    const onSelect = args.onSelect;
    const onFail = args.onFail;
    const dfs = async (x, l, r) => {
        if (onEnter) await onEnter(x, l, r, ql, qr);
        if (l > qr || r < ql) {
            if (onFail) await onFail(x, l, r, ql, qr);
            return;
        }
        if (ql <= l && r <= qr) {
            if (onSelect) await onSelect(x, l, r, ql, qr);
            return;
        }
        const mid = (l + r) >> 1;
        await dfs(lc(x), l, mid);
        await dfs(rc(x), mid + 1, r);
        if (onExit) await onExit(x, l, r, ql, qr);
    };
    await dfs(1, tree._.l, tree._.r);
}
