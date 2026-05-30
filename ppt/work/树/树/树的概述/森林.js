import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 7],
    [4, 8],
    [4, 9],
    [5, 10],
    [5, 11],
];
const t = new sd.Tree(svg).width(1000).layerHeight(80).cx(600).y(50);

sd.init(() => {
    links.forEach(([x, y]) => {
        t.link(x, y);
    });
});

sd.main(async () => {
    await sd.pause();
    t.startAnimate();
    t.cut(1, 2);
    t.cut(1, 3);
    t.endAnimate();
});
