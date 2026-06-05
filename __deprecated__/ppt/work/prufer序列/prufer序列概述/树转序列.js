import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const arr = new sd.Array(svg);
const n = 7;
const links = [
    [2, 1],
    [2, 3],
    [2, 4],
    [2, 7],
    [3, 5],
    [3, 6]
];

sd.init(() => {
    tree.root(2);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    arr.y(tree.my() + 50);
})

sd.main(async () => {
    for (let i = 1; i <= n - 2; i++) {
        await FindAndDelete();
    }
})

async function FindAndDelete() {
    let id = n;
    for (let i = 1; i <= n; i++) {
        if (tree.element(i).color().main === C.grey) continue;
        const children = tree.children(i).filter((child => child.color().main !== C.grey));
        if (children.length > 0) continue;
        id = i;
        break;
    }
    await sd.pause();
    tree.startAnimate().color(id, C.blue).endAnimate();
    await sd.pause();
    arr.startAnimate().push(tree.fatherId(id)).endAnimate();
    await sd.pause();
    tree.startAnimate().color(id, C.grey).endAnimate();
}