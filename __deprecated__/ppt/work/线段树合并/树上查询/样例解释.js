import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const arr = new sd.Array(svg).start(1);
const n = 6;
const links = [
    [1, 6],
    [6, 5],
    [6, 2],
    [2, 3],
    [2, 4],
];
const lcaFocus = sd.Focus(tree);

const panel = new sd.ValueStack(svg);
const lSlider = new sd.Slider(svg)
    .min(1)
    .max(n)
    .value(1)
    .childAs("lb", new sd.Text(svg, 1), R.aside("lc"))
    .onChange(value => lSlider.child("lb").text(value));
const rSlider = new sd.Slider(svg)
    .min(1)
    .max(n)
    .value(n)
    .childAs("lb", new sd.Text(svg, n), R.aside("lc"))
    .onChange(value => rSlider.child("lb").text(value));
const lcaButton = new sd.Button(svg)
    .onClick(() => {
        sd.inter(async () => {
            const l = Math.min(lSlider.value(), rSlider.value());
            const r = Math.max(lSlider.value(), rSlider.value());
            await LCA(l, r);
        });
    })
    .text("LCA*");

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        arr.push(i);
    }
    arr.cx(tree.cx()).y(tree.my() + 60);
    panel.push(lSlider);
    panel.push(rSlider);
    panel.push(lcaButton);
    panel.cy(tree.cy()).x(tree.mx());
});

sd.main(async () => {});

async function LCA(l, r) {
    arr.startAnimate();
    tree.startAnimate();
    for (let i = l; i <= r; i++) {
        arr.color(i, C.blue);
        tree.color(i, C.blue);
    }
    arr.endAnimate();
    tree.endAnimate();

    await sd.pause();
    let lca = l;
    for (let i = l + 1; i <= r; i++) {
        lca = tree.nodeId(tree.lca(lca, i));
    }
    lcaFocus.startAnimate().focus(lca).endAnimate();

    await sd.pause();
    lcaFocus.startAnimate().focus(null).endAnimate();
    arr.startAnimate().color(C.white).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}
