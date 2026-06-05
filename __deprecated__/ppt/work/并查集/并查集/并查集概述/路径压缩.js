import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const links = [
    [1, 2],
    [1, 3],
    [2, 6],
    [3, 8],
    [3, 9],
    [9, 10],
    [9, 11],
];
const at = 10;
const t = new sd.Tree(svg).width(600).cx(600).y(200).root(1);
const fa = sd.make1d(100);
const focus = sd.CircleFocus(t);

sd.init(() => {
    fa[1] = 1;
    links.forEach(link => {
        t.link(link[0], link[1]);
        fa[link[1]] = link[0];
    });
});

sd.main(async () => {
    await getFa(at);
});

async function getFa(x) {
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    t.startAnimate().color(x, C.blue).endAnimate();
    if (fa[x] === x) return x;
    const father = await getFa(fa[x]);
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    if (fa[x] !== father) {
        await sd.pause();
        t.startAnimate().freeze();
        t.cut(fa[x], x);
        t.link(father, x);
        t.unfreeze().endAnimate();
        fa[x] = father;
    }
    return father;
}
