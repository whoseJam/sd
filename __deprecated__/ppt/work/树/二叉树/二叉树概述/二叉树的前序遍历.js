import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 2, 3],
    [2, 4, 5],
    [3, 6, 7],
    [4, 8, 9],
    [5, 10, 0],
];
const t = new sd.BinaryTree(svg).root(1).width(600).cx(600).y(100);
const arr = new sd.Array(svg).x(400).y(350);

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        const [prt, lc, rc] = data[i];
        if (lc) t.leftChild(prt, lc);
        if (rc) t.rightChild(prt, rc);
    }
});

sd.main(async () => {
    await dfs(1);
});

async function dfs(u) {
    await sd.pause();
    t.startAnimate();
    t.color(u, C.green);
    t.endAnimate();
    await sd.pause();
    const tv = t.value(u);
    const text = new sd.Text(svg, tv.text()).fontSize(tv.fontSize()).center(tv.center());
    arr.startAnimate().pushFromExistValue(text).endAnimate();
    if (t.leftChild(u)) await dfs(t.leftChildId(u));
    if (t.rightChild(u)) await dfs(t.rightChildId(u));
    await sd.pause();
    t.startAnimate();
    t.color(u, C.grey);
    t.endAnimate();
}
