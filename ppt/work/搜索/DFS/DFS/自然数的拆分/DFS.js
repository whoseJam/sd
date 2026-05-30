import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 4;
const tree = new sd.BoxTree(svg).width(1200).dy(22).elementWidth(60).elementHeight(30).layerHeight(100);
const array = new sd.Array(svg).start(1).elementWidth(20).elementHeight(20);
const text = new sd.Text(svg, "sum=0");
array.childAs(text, R.aside("bc", -1));
const arr = [];
let currentSum = 0;
let tot = 0;

sd.init(() => {
    dfs(1, 1, 0);
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
    moveCurrent(tree.element(1));
});

sd.main(async () => {
    await dfsNode(1);
});

function moveCurrent(element) {
    array.cx(element.cx()).my(element.y() - 25);
}

async function dfsNode(x) {
    const element = tree.element(x);
    const children = tree.children(element);
    for (const child of children) {
        await sd.pause();
        const link = tree.element(x, child);
        currentSum += link.add;
        array.startAnimate();
        text.text(`sum=${currentSum}`, { "sum=": "sum=" });
        array.push(link.add);
        moveCurrent(child);
        array.endAnimate();
        link.opacity(1).startAnimate().pointStoT().endAnimate();
        child.startAnimate().opacity(1).childAs("split", makeSplit(), R.aside("rt")).endAnimate();

        await dfsNode(tree.nodeId(child));

        await sd.pause();
        currentSum -= link.add;
        array.startAnimate();
        text.text(`sum=${currentSum}`, { "sum=": "sum=" });
        array.pop();
        moveCurrent(element);
        array.endAnimate();
        child.child("split").startAnimate().color(C.grey).endAnimate();
    }
    await sd.pause();
    if (tree.children(element).length === 0) {
        if (sum(array) === n) element.startAnimate().color(C.orange).endAnimate();
        else element.startAnimate().color(C.red).endAnimate();
    }
}

function dfs(d, lim, sum) {
    const current = ++tot;
    tree.newNode(current, `D(${d})`);
    if (d === n + 1) return current;
    for (let i = lim, v; i <= n; i++) {
        if (sum + i <= n) {
            arr.push(i);
            tree.newLink(current, (v = dfs(d + 1, i, sum + i)));
            tree.element(current, v).add = i;
            arr.pop();
        }
    }
    return current;
}

function sum(arr) {
    let ans = 0;
    arr.forEachElement(element => (ans += element.intValue()));
    return ans;
}

function makeSplit() {
    if (array.length === 0) return new sd.Text(tree, "空数组");
    const arr = new sd.Array(tree).elementWidth(20).elementHeight(20);
    array.forEachElement(element => arr.push(element.intValue()));
    return arr.color(C.blue);
}
