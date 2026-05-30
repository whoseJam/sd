import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const n = 9;

sd.init(() => {
    for (let i = 1; i < n; i++) {
        tree.link(i, i + 1);
    }
});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate().color(n, C.red).endAnimate();
    for (let i = 1, k = 1; i <= n; i <<= 1, k++) {
        await sd.pause();
        const focus = sd
            .Focus(tree)
            .gap(k * 5 - 3)
            .startAnimate()
            .focus(tree.element(n), tree.element(n - i + 1))
            .endAnimate();
        focus.after(0);
        sd.Aside(focus, new sd.Box(svg, new sd.Math(svg, `L_{${k}}`)).width(30).height(15), "tl", 1);
    }
});
