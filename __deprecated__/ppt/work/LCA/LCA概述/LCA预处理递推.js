import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const n = 5;

sd.init(() => {
    tree.root(1);
    for (let i = 2; i <= n; i++) {
        tree.link(i - 1, i);
    }
});

sd.main(async () => {
    for (let i = 2; i <= 4; i <<= 1) {
        const mid = n - i / 2;
        const final = n - i;
        await sd.pause();
        const links = [];
        links.push(link(n, mid, C.red, `${n}的${i / 2}级祖先`));
        await sd.pause();
        links.push(link(mid, final, C.orange, `${mid}的${i / 2}级祖先`));
        await sd.pause();
        links.push(link(n, final, C.black, `${n}的${i}级祖先`, -0.5, "mx"));
        await sd.pause();
        links.forEach(link => link.startAnimate().opacity(0).remove());
    }
});

function link(u, v, col, label, bend = 0.5, xloc = "x") {
    const nodeU = tree.element(u);
    const nodeV = tree.element(v);
    const l = sd.Link(nodeU, nodeV, sd.Curve).bending(bend).stroke(col);
    return l.startAnimate().pointStoT().value(label, R.pointAtPathByRate(0.5, xloc, "cy")).endAnimate().arrow();
}
