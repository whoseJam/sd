import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const bi = new sd.BipartiteGraph(svg).height(200);
const n = 8;
const links = [
    [1, 5],
    [2, 5],
    [3, 5],
    [3, 6],
    [4, 8],
    [2, 8]
]

sd.init(() => {
    const h = Math.floor(n / 2);
    for (let i = 1; i <= h; i++) bi.newNode(i, 0);
    for (let i = h + 1; i <= n; i++) bi.newNode(i, 1);
    links.forEach(link => bi.link(link[0], link[1]));
    sd.Label(bi.element(1), "乘客", "lc", 20, 20);
    sd.Label(bi.element(h + 1), "座位", "lc", 20, 20);
})

sd.main(async () => {
    await Match([[3, 5], [2, 8]]);
    await Match([[3, 5], [4, 8]]);
    await Match([[1, 5], [3, 6], [4, 8]]);
})

async function Match(matches) {
    await sd.pause();
    matches.forEach(match => {
        const link = bi.element(match[0], match[1]);
        link.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    })
    await sd.pause();
    matches.forEach(match => {
        const link = bi.element(match[0], match[1]);
        link.startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
    })
}