import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(500);
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [7, 10],
    [8, 11],
    [8, 12],
    [9, 13],
    [10, 14],
    [11, 15],
    [12, 16],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {
    await bruteForceLCA(4, 12);
    await bruteForceLCA(10, 16);
    await bruteForceLCA(4, 7);
});

async function bruteForceLCA(x, y) {
    [x, y] = [String(x), String(y)];
    await sd.pause();
    if (tree.depth(x) > tree.depth(y)) {
        let tmp = x;
        x = y;
        y = tmp;
    }
    const px = sd.Pointer(tree, "x", "r", 3, 20).startAnimate().moveTo(x).endAnimate();
    const py = sd.Pointer(tree, "y", "l", 3, 20).startAnimate().moveTo(y).endAnimate();
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
