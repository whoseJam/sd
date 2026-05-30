import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 11;
const values = [-8, 1, 5, 4, 2];
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
];
const t = new sd.Tree(svg).width(1000).layerHeight(80).cx(600).y(50);

sd.init(() => {
    values.forEach((value, i) => {
        t.newNode(i + 1, value);
        t.element(i + 1).childAs("sum", new sd.Text(svg, "0"), R.aside("lc", 15));
    });
    links.forEach(([x, y]) => {
        t.link(x, y);
    });
});

sd.main(async () => {
    await dfs(1);
});

async function dfs(u) {
    await sd.pause();
    const sum = t.element(u).child("sum");
    sum.startAnimate().text(t.intValue(u)).endAnimate();
    for (const child of t.children(u)) {
        await dfs(t.nodeId(child));
        await sd.pause();
        const csum = child.child("sum");
        sd.Link(csum, sum).startAnimate().pointStoT().endAnimate().arrow();
        sum.startAnimate()
            .text(+sum.text() + +csum.text())
            .endAnimate();
    }
}
