import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const dag = new sd.DAG(svg).width(600).cx(600).cy(300);
const fa = sd.make1d(100);
const data = [
    [1, 2],
    [4, 5],
    [3, 6],
    [1, 6],
    [2, 6],
    [6, 8],
    [3, 7],
    [6, 5],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        dag.newNode(i);
        fa[i] = i;
    }
});

sd.main(async () => {
    for (let i = 0; i < data.length; i++) {
        await merge(data[i][0], data[i][1]);
    }
});

function getFa(x) {
    if (fa[x] === x) return x;
    return getFa(fa[x]);
}

function mark(node) {
    node.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
}

function unmark(node) {
    node.startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
}

async function merge(x, y) {
    await sd.pause();
    dag.startAnimate().color(x, C.blue).color(y, C.blue).endAnimate();
    const fx = getFa(x);
    const nodeFx = dag.element(fx);
    const fy = getFa(y);
    const nodeFy = dag.element(fy);
    if (fx === fy) {
        await sd.pause();
        mark(nodeFx);
        await sd.pause();
        unmark(nodeFx);
        await sd.pause();
        dag.startAnimate().color(x, C.white).color(y, C.white).endAnimate();
        return;
    }
    await sd.pause();
    mark(nodeFx);
    mark(nodeFy);
    await sd.pause();
    dag.startAnimate();
    dag.newLink(fy, fx);
    dag.endAnimate();
    dag.element(fy, fx).after(0).revArrow();
    fa[fx] = fy;
    await sd.pause();
    unmark(nodeFx);
    unmark(nodeFy);
    await sd.pause();
    dag.startAnimate().color(x, C.white).color(y, C.white).endAnimate();
}
