import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const n = 12;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [5, 8],
    [6, 9],
    [7, 10],
    [7, 11],
    [8, 12],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.width(400).cx(600).cy(300);
});

sd.main(async () => {
    const focus = sd.Focus(tree);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        focus.startAnimate().focus(i).endAnimate();
        await sd.pause();
        tree.startAnimate();
        add(i);
        tree.endAnimate();
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
        tree.startAnimate();
        clear(i);
        tree.endAnimate();
    }
});

function add(u) {
    tree.color(u, C.green);
    const children = tree.children(u);
    children.forEach(child => {
        add(tree.nodeId(child));
    });
}

function clear(u) {
    tree.color(u, C.white);
    const children = tree.children(u);
    children.forEach(child => {
        clear(tree.nodeId(child));
    });
}
