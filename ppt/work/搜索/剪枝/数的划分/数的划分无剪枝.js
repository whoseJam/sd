import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const k = 3;
const tree = new sd.ValueTree(svg).width(1000).dy(22);
const arr = [];
let tot = 0;

sd.init(() => {
    dfs(1, 1);
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
});

sd.main(async () => {
    let current = [1];
    let next = [];
    while (current.length > 0) {
        await sd.pause();
        for (const x of current) {
            const children = tree.children(x);
            for (const child of children) {
                child.startAnimate().opacity(1).endAnimate();
                const link = tree.element(x, child);
                link.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
                next.push(+tree.nodeId(child));
                if (tree.children(child).length === 0) {
                    child
                        .after(0)
                        .startAnimate()
                        .color(sum(child) === n && child.length() === k ? C.orange : C.red)
                        .endAnimate();
                }
            }
        }
        [current, next] = [next, []];
    }
});

function dfs(d, lim) {
    const current = ++tot;
    tree.newNode(current, makeDivide(arr));
    if (d === k + 1) return current;
    for (let i = lim; i <= n; i++) {
        if (sum(arr) + i > n) break;
        arr.push(i);
        tree.newLink(current, dfs(d + 1, i));
        arr.pop();
    }
    return current;
}

function makeDivide(arr) {
    if (arr.length === 0) return new sd.Text(tree, "空数组");
    return new sd.Array(svg).elementWidth(20).elementHeight(20).pushArray(arr);
}

function sum(arr) {
    let ans = 0;
    if (arr instanceof sd.Array) arr.forEachElement(element => (ans += element.intValue()));
    else for (const a of arr) ans += a;
    return ans;
}
