import * as sd from "@/sd";

const R = sd.rule();

export class SegmentTree extends sd.ValueTree {
    constructor(target, n) {
        super(target);

        this.vars.merge({
            stackWidth: 12,
            stackHeight: 12,
        });

        this.layerHeight(80).width(800);
        const build = (x, l, r) => {
            this.newNode(x, makeArray(this, l, r));
            if (x > 1) this.newLink(x >> 1, x);
            if (l === r) return;
            const mid = (l + r) >> 1;
            build(lc(x), l, mid);
            build(rc(x), mid + 1, r);
        };
        build(1, 1, n);
        this._.n = n;
    }
    insert(ql, qr, item) {
        const insert = (x, l, r) => {
            if (ql <= l && r <= qr) {
                const stk = this.element(x).child("stk");
                stk.push(item());
                return;
            }
            if (l === r) return;
            const mid = (l + r) >> 1;
            if (ql <= mid) insert(lc(x), l, mid);
            if (qr > mid) insert(rc(x), mid + 1, r);
        };
        insert(1, 1, this._.n);
        return this;
    }
    stackWidth(width) {
        if (arguments.length === 0) return this.vars.stackWidth;
        this.vars.stackWidth = width;
        return this;
    }
    stackHeight(height) {
        if (arguments.length === 0) return this.vars.stackHeight;
        this.vars.stackHeight = height;
        return this;
    }
    /**
     *
     * @param {{
     *   onCreateMover: () => sd.SDNode;
     *   onEnter: (mover: sd.SDNode, elements: Array<sd.SDNode>) => void;
     *   onExit: (mover: sd.SDNode, count: number) => Array<sd.SDNode>;
     *   onLeaf: (i: number) => void;
     * }} args
     */
    async dfsAysnc(args = {}) {
        const tree = this;
        const onCreateMover =
            args.onCreateMover ||
            function () {
                const box = new sd.Box(tree).width(60).height(15);
                box.value(new sd.ValueArray(box).elementWidth(12).elementHeight(12), R.center());
                return box;
            };
        const onEnter =
            args.onEnter ||
            function (mover, elements) {
                const arr = mover.value();
                arr.startAnimate().freeze();
                elements.forEach(element => arr.pushFromExistElement(element));
                arr.unfreeze().endAnimate();
            };
        const onExit =
            args.onExit ||
            function (mover, count) {
                const arr = mover.value();
                const elements = [];
                arr.startAnimate().freeze();
                for (let i = 0; i < count; i++) elements.push(arr.dropLastElement());
                arr.unfreeze().endAnimate();
                return elements;
            };
        const onLeaf = args.onLeaf;

        const mover = await onCreateMover();
        mover.opacity(0);
        mover.moveTo = function (x) {
            x = tree.element(x);
            if (this.opacity() === 0) {
                return this.cx(x.cx())
                    .my(x.y() - 10)
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
            } else {
                return this.startAnimate()
                    .cx(x.cx())
                    .my(x.y() - 10)
                    .endAnimate();
            }
        };
        const enter = async x => {
            const stk = this.element(x).child("stk");
            const len = stk.length();
            if (len > 0) await sd.pause();
            const elements = [];
            stk.startAnimate().freeze();
            for (let i = 0; i < len; i++) elements.push(stk.dropFirstElement());
            stk.unfreeze().endAnimate();
            if (onEnter) await onEnter(mover, elements);
            return len;
        };
        const exit = async (x, len) => {
            if (len > 0) await sd.pause();
            const stk = this.element(x).child("stk");
            const elements = await onExit(mover, len);
            stk.startAnimate().freeze();
            for (let i = 0; i < len; i++) stk.pushFromExistElement(elements[i]);
            stk.unfreeze().endAnimate();
            if (x > 1) {
                await sd.pause();
                mover.moveTo(x >> 1);
            }
        };
        const dfs = async (x, l, r) => {
            await sd.pause();
            mover.moveTo(x);
            const len = await enter(x);
            if (l === r) {
                if (onLeaf) await onLeaf(l);
                await exit(x, len);
                return;
            }
            const mid = (l + r) >> 1;
            await dfs(lc(x), l, mid);
            await dfs(rc(x), mid + 1, r);
            await exit(x, len);
        };
        await dfs(1, 1, this._.n);
    }
}

function makeArray(target, l, r) {
    const arr = new sd.Array(target);
    arr.resize(r - l + 1).start(l);
    arr.childAs("stk", new sd.ValueStack(arr), R.aside("rt"));
    target.effect(`${l}-${r}`, () => {
        const stk = arr.child("stk");
        stk.elementWidth(target.stackWidth());
        stk.elementHeight(target.stackHeight());
    });
    return arr;
}

function lc(x) {
    return x * 2;
}

function rc(x) {
    return x * 2 + 1;
}
