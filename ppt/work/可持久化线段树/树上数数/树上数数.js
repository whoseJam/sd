import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const n = 11;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 7],
    [6, 8],
    [6, 9],
    [7, 10],
    [7, 11],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        const e = tree.element(i);
        const math = new sd.Math(e, `insert(a_{${i}})`);
        e.childAs("math", math, R.aside(getLocator(i)));
    }
});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    for (let i = 1; i <= 7; i++) tree.color(i, C.green);
    tree.endAnimate();
    await sd.pause();
});

function getLocator(x) {
    if (x <= 7) return x & 1 ? "rc" : "lc";
    if (x === 8) return "lc";
    if (x === 9 || x === 10) return "bc";
    return "rc";
}
