import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const board = new sd.Text(svg).x(550).y(100);
const tree = new sd.Tree(svg).x(300).y(120);
const vs = [];
const edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
];
for (let i = 1; i <= 5; i++) {
    let a = new sd.Array(svg);
    sd.Label(a, `G[${i}]`);
    vs.push(a);
}

sd.init(() => {
    const x = 200;
    const y = 100;
    const dy = 50;
    for (let i = 0; i < vs.length; i++) {
        vs[i].x(x).y(y + i * dy);
    }
});

sd.main(async () => {
    for (let i = 0; i < edges.length; i++) {
        const [x, y] = edges[i];
        await sd.pause();
        board.startAnimate().text(`Link ${x} <-> ${y}`, { "Link": "Link", "<->": "<->" }).endAnimate();
        await sd.pause();
        tree.startAnimate().link(x, y).endAnimate();
        vs[x - 1].startAnimate().push(y).endAnimate();
        vs[y - 1].startAnimate().push(x).endAnimate();
    }
});
