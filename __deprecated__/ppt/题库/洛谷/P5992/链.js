import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.HorizontalTree(svg);

sd.init(() => {
    tree.root(1);
    for (let i = 1; i <= 4; i++)
        tree.link(i, i + 1);
})

sd.main(async () => {
    await sd.pause();
    sd.Label(tree.element(1), "$v_S$", "bc", 15).opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Label(tree.element(5), "$v_T$", "bc", 15).opacity(0).startAnimate().opacity(1).endAnimate();
})