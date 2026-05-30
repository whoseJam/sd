import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 8;
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
                await Query(index);
            });
        });
        element.onDblClick(() => {
            sd.inter(async () => {
                await Add(index, 1);
            });
        });
    }
});

sd.main(async () => {
    await Prepare();
    await BuildTree();
    await sd.pause();
    const l1 = new sd.Line(svg).source([0, -260]).target([0, 40]).strokeWidth(3).stroke(C.red).opacity(0).startAnimate().opacity(1).endAnimate();
    const l2 = new sd.Line(svg).source([40, -260]).target([40, 40]).strokeWidth(3).stroke(C.red).opacity(0).startAnimate().opacity(1).endAnimate();
    tree[1].startAnimate().color(C.orange).endAnimate();
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        tree[i - 1].startAnimate().color(C.white).endAnimate();
        tree[i].startAnimate().color(C.orange).endAnimate();
        l1.startAnimate().dx(40).endAnimate();
        l2.startAnimate().dx(40).endAnimate();
    }
    await sd.pause();
    tree[n].startAnimate().color(C.white).endAnimate();
    l1.startAnimate().opacity(0).endAnimate();
    l2.startAnimate().opacity(0).endAnimate();
});

async function BuildTree() {
    for (let i = 1; i <= n; i++) {
        const parent = i + lowbit(i);
        if (parent <= n) {
            sd.Link(tree[parent].lastElement(), tree[i].lastElement(), sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate().arrow();
        }
    }
}

async function Add(x, d) {
    const element = arr.element(x);
    const text = new sd.Text(svg, `+${d}`).cx(element.cx()).my(element.y());
    const allTexts = [];
    arr.startAnimate().color(x, C.blue).endAnimate();
    await sd.pause();
    let timestamp = 0;
    for (let i = x; i <= n; i += lowbit(i)) {
        tree[i].after(timestamp).startAnimate().color(C.blue).endAnimate();
        const t = new sd.Text(svg, text.text()).cx(element.cx()).my(element.y());
        t.after(timestamp)
            .startAnimate()
            .mx(tree[i].x() - 3)
            .cy(tree[i].cy())
            .endAnimate();
        timestamp = tree[i].delay();
        allTexts.push(t);
    }
    await sd.pause();
    allTexts.forEach(t => t.startAnimate().opacity(0).remove());
    text.startAnimate().opacity(0).remove();
    element.startAnimate().color(C.white).endAnimate();
    for (let i = x; i <= n; i += lowbit(i)) {
        tree[i].startAnimate().color(C.white).endAnimate();
    }
}

async function Query(x) {
    let cur = 0,
        timestamp = 0;
    for (let i = x; i > 0; i -= lowbit(i)) {
        const l = i - lowbit(i) + 1;
        const r = i;
        arr.after(timestamp).startAnimate().color(l, r, C.orange).endAnimate();
        focuses[cur++].after(timestamp).startAnimate().focus(l, r).endAnimate();
        tree[r].after(timestamp).startAnimate().color(C.orange).endAnimate();
        timestamp = arr.delay();
    }
    await sd.pause();
    focuses.forEach(focus => focus.startAnimate().focus(null).endAnimate());
    arr.startAnimate().color(C.white).endAnimate();
    for (let i = x; i > 0; i -= lowbit(i)) tree[i].startAnimate().color(C.white).endAnimate();
}

async function Prepare() {
    for (let i = 1; i <= n; i++) {
        await sd.pause(sd.CONTINUE_STAGE);
        arr.startAnimate().color(1, i, C.blue).endAnimate();
        await sd.pause(sd.CONTINUE_STAGE);
        const result = BinarySplit(i);
        await sd.pause(sd.CONTINUE_STAGE);
        MakeTree(result);
    }
    await sd.pause(sd.CONTINUE_STAGE);
    focuses.forEach(focus => focus.startAnimate().focus(null).endAnimate());
    arr.startAnimate().color(C.white).endAnimate();
    await sd.pause();
}

function MakeTree(result) {
    for (let i = 0; i < result.length; i++) {
        const range = result[i];
        const len = range[1] - range[0] + 1;
        const arr = new sd.Array(svg).resize(len).start(range[0]);
        arr.dx((range[0] - 1) * 40);
        arr.opacity(0)
            .startAnimate()
            .dy(Math.log2(len) * -60 - 80)
            .opacity(1)
            .endAnimate();
        if (!tree[range[1]]) {
            tree[range[1]] = arr;
        } else {
            arr.remove();
        }
    }
}

function BinarySplit(x) {
    const result = [];
    let curIndex = 0,
        curPos = 1;
    for (let i = 10; i >= 0; i--) {
        if (x & (1 << i)) {
            if (curIndex >= focuses.length) {
                focuses.push(sd.Focus(arr).clickable(false));
            }
            focuses[curIndex++]
                .startAnimate()
                .focus(curPos, curPos + (1 << i) - 1)
                .endAnimate();
            result.push([curPos, curPos + (1 << i) - 1]);
            curPos += 1 << i;
        }
    }
    for (let i = curIndex; i < focuses.length; i++) {
        focuses[i].startAnimate().focus(null).endAnimate();
    }
    return result;
}
