import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(200);
const n = 9;
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 6],
    [6, 7],
    [7, 8],
    [8, 9],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {
    await bruteForceLCA(4, 9);
    await bruteForceLCA(8, 5);
});

async function bruteForceLCA(x, y) {
    await sd.pause();
    if (tree.depth(x) > tree.depth(y)) {
        let tmp = x;
        x = y;
        y = tmp;
    }
    let dx;
    let dy;
    if (tree.element(x).cx() < tree.element(y).cx()) (dx = "r"), (dy = "l");
    else (dx = "l"), (dy = "r");
    const px = sd.Pointer(tree, "x", dx, 3, 20).startAnimate().moveTo(x).endAnimate();
    const py = sd.Pointer(tree, "y", dy, 3, 20).startAnimate().moveTo(y).endAnimate();
    while (tree.depth(y) > tree.depth(x)) {
        const fa = tree.fatherId(y);
        await sd.pause();
        py.startAnimate().moveTo(fa).endAnimate();
        y = fa;
    }
    while (x !== y) {
        await sd.pause();
        const fax = tree.fatherId(x);
        const fay = tree.fatherId(y);
        px.startAnimate().moveTo(fax).endAnimate();
        py.startAnimate().moveTo(fay).endAnimate();
        x = fax;
        y = fay;
    }
    await sd.pause();
    tree.startAnimate().color(x, C.green).endAnimate();
    await sd.pause();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
    tree.startAnimate().color(x, C.white).endAnimate();
}
