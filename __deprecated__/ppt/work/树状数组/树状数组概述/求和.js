import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 12;
const arr = new sd.Array(svg).start(1);
const tree = sd.make1d(n + 5);
const pI = sd.Pointer(arr, "i", "t", 5, 30, 5);

function lowbit(x) {
    return x & -x;
}

sd.init(() => {
    arr.resize(n);
    for (let i = 1; i <= n; i++) {
        const element = arr.element(i);
        const index = i;
        element.onClick(() => {
            sd.inter(async () => {
                await Query(index);
            });
        });
    }
    Prepare();
    BuildTree();
});

sd.main(async () => {});

async function Query(x) {
    const allLinks = [];
    for (let i = x, last = x; i >= 0; i -= lowbit(i)) {
        if (i === x) {
            pI.startAnimate().moveTo(i).endAnimate();
        } else {
            await sd.pause();
            const l = new sd.Line(svg);
            l.source(pI.pos("cx", "cy", -5));
            if (i === 0) pI.startAnimate().cx(0).endAnimate();
            else pI.startAnimate().moveTo(i).endAnimate();
            l.target(pI.pos("cx", "cy", +5));
            l.startAnimate()
                .pointStoT()
                .value(new sd.Text(svg, `L(${last})`).fontSize(10), R.pointAtPathByRate(0.5, "cx", "y", 0, 5))
                .endAnimate()
                .arrow();
            allLinks.push(l);
            if (i === 0) break;
            last -= lowbit(last);
        }
        tree[i].startAnimate().color(C.orange).endAnimate();
    }
    await sd.pause();
    pI.startAnimate().moveTo(null).endAnimate();
    for (let i = x; i > 0; i -= lowbit(i)) {
        tree[i].startAnimate().color(C.white).endAnimate();
    }
    allLinks.forEach(l => l.startAnimate().opacity(0).endAnimate().remove());
}

function BuildTree() {
    for (let i = 1; i <= n; i++) {
        const parent = i + lowbit(i);
        if (parent <= n) {
            sd.Link(tree[parent].lastElement(), tree[i].lastElement(), sd.Line, "cx", "my", "cx", "y").arrow();
        }
    }
}

function Prepare() {
    for (let i = 1; i <= n; i++) {
        const result = BinarySplit(i);
        MakeTree(result);
    }
}

function MakeTree(result) {
    for (let i = 0; i < result.length; i++) {
        const range = result[i];
        const len = range[1] - range[0] + 1;
        if (!tree[range[1]]) {
            const arr = new sd.Array(svg).resize(len).start(range[0]);
            arr.dx((range[0] - 1) * 40);
            arr.dy(Math.log2(len) * -60 - 80);
            tree[range[1]] = arr;
        }
    }
}

function BinarySplit(x) {
    const result = [];
    let curPos = 1;
    for (let i = 10; i >= 0; i--) {
        if (x & (1 << i)) {
            result.push([curPos, curPos + (1 << i) - 1]);
            curPos += 1 << i;
        }
    }
    return result;
}
