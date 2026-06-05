import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 3;
const tree = new sd.BoxTree(svg).width(1000).dy(22).elementWidth(60).elementHeight(30).layerHeight(100);
const permutationArray = new sd.Array(svg).start(1).elementWidth(20).elementHeight(20);
const usedArray = new sd.Array(svg).start(1).elementWidth(20).elementHeight(20);
const arr = [];
const used = sd.make1d(n + 5, false);
let tot = 0;

sd.init(() => {
    dfs(1);
    for (let i = 1; i <= n; i++) usedArray.push(i);
    usedArray.childAs(permutationArray, R.aside("bl", 10));
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
    sd.Label(usedArray, "used");
    sd.Label(permutationArray, "arr");
    moveCurrent(tree.element(1));
});

sd.main(async () => {
    await dfsNode(1);
});

function moveCurrent(element) {
    usedArray.my(element.cy() - 50).cx(element.cx());
}

function makePermutation() {
    const arr = new sd.Array(svg).elementWidth(20).elementHeight(20);
    for (let i = 1; i <= permutationArray.length(); i++) arr.push(permutationArray.intValue(i));
    return arr.color(C.blue);
}

async function dfsNode(x) {
    const element = tree.element(x);
    const children = tree.children(element);
    for (const child of children) {
        await sd.pause();
        const link = tree.element(x, child);
        usedArray.startAnimate();
        permutationArray.push(link.add);
        usedArray.color(link.add, C.grey);
        moveCurrent(child);
        usedArray.endAnimate();
        link.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        child.startAnimate().opacity(1).childAs("permutation", makePermutation(), R.aside("rt")).endAnimate();

        await dfsNode(tree.nodeId(child));

        await sd.pause();
        usedArray.startAnimate();
        permutationArray.pop();
        usedArray.color(link.add, C.white);
        moveCurrent(element);
        usedArray.endAnimate();
        child.child("permutation").startAnimate().color(C.grey).endAnimate();
    }
    await sd.pause();
    if (tree.children(element).length === 0) {
        element.startAnimate().color(C.orange).endAnimate();
    }
}

function dfs(d) {
    const current = ++tot;
    tree.newNode(current, `P(${d})`);
    if (d === n + 1) return current;
    for (let i = 1, v; i <= n; i++) {
        if (!used[i]) {
            used[i] = true;
            arr.push(i);
            tree.newLink(current, (v = dfs(d + 1)));
            tree.element(current, v).add = i;
            used[i] = false;
            arr.pop();
        }
    }
    return current;
}
