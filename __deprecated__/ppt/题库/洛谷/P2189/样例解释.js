import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const links = [
    [1, 2],
    [2, 3],
    [3, 1],
    [1, 4],
    [4, 5],
    [4, 6],
    [5, 6],
    [3, 4],
];
const keyNodes = [1, 3, 6];
const graph = new sd.TinyGraph(svg).scale(0.8);

sd.init(() => {
    for (let i = 1; i <= n; i++) graph.newNode(i);
    links.forEach(([x, y]) => {
        graph.link(x, y);
    });
    graph.forEachNode(node => {
        let flag = 0;
        node.onClick(() => {
            sd.inter(async () => {
                node.startAnimate()
                    .color(flag ? C.white : C.grey)
                    .endAnimate();
                flag ^= 1;
            });
        });
        if (sd.rand(1, 6) <= 3) node.strokeWidth(3).stroke(C.red);
    });
});

sd.main(async () => {});
