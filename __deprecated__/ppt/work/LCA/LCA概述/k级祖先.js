import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [4, 5],
    [5, 6],
    [6, 7],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {
    let u = 7;
    let i = 0;
    const ns = tree.element(u);
    await sd.pause();
    ns.startAnimate().color(C.blue).endAnimate();
    while (u) {
        u = tree.fatherId(u);
        if (!u) break;
        const nu = tree.element(u);
        await sd.pause();
        nu.startAnimate().color(C.green).endAnimate();
        await sd.pause();
        const link = sd.Link(ns, nu, sd.Curve).bending(0.5);
        link.startAnimate().pointStoT().value(`${++i}级祖先`, R.pointAtPathByRate(0.5, "x", "cy")).endAnimate().arrow();
        await sd.pause();
        link.startAnimate().opacity(0).endAnimate();
        nu.startAnimate().color(C.white).endAnimate();
    }
});
