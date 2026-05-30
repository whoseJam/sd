import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 12;
const arr = new sd.Array(svg).start(1);
const tree = sd.make1d(n + 5);
const focuses = [];

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
                await Lowbit(index);
            });
        });
    }
    Prepare();
    BuildTree();
});

sd.main(async () => {});

async function Lowbit(x) {
    const str = CastBinToStr(x);
    const t1 = new sd.Math(svg, `${x}=(${str})_2`);
    const t2 = new sd.Math(svg, `lowbit(${x})=lowbit((${str})_2)=${lowbit(x)}`);
    t1.cx(arr.cx())
        .y(arr.my() + 20)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    t2.cx(arr.cx())
        .y(t1.my() + 5)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    arr.startAnimate().color(x, C.blue).endAnimate();
    await sd.pause();
    const result = BinarySplit(x);
    let cur = 0;
    for (let range of result) {
        if (cur >= focuses.length) focuses.push(sd.Focus(arr));
        focuses[cur++].startAnimate().focus(range[0], range[1]).endAnimate();
    }
    for (let i = cur; i < focuses.length; i++) focuses[i].startAnimate().focus(null).endAnimate();

    await sd.pause();
    t1.startAnimate().opacity(0).remove();
    t2.startAnimate().opacity(0).remove();
    focuses.forEach(focus => focus.startAnimate().focus(null).endAnimate());
    arr.startAnimate().color(x, C.white).endAnimate();
}

function CastBinToStr(x) {
    let str = "";
    while (x) {
        str = String(x & 1) + str;
        x >>= 1;
    }
    return str;
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
