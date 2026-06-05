import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const rect = new sd.Rect(svg).x(-40).y(-40).width(380).height(380).color(C.BLUE);
const graph = new sd.GridGraph(svg).n(5).m(5);
const pos = [
    [4, 2],
    [0, 2],
    [3, 4],
    [5, 0],
    [2, 2],
    [4, 0],
    [1, 5],
    [0, 0],
    [0, 3],
    [2, 4],
    [3, 3],
];

sd.init(() => {
})

sd.main(async () => {
    await sd.pause();
    sd.Label(rect, "状态空间", "tc").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    for (let i = 0; i < pos.length; i++) {
        graph.startAnimate().at(pos[i][0], pos[i][1]).newNode(i + 1).endAnimate();
    }
    async function focus(d) {
        await sd.pause();
        for (let i = 0; i < pos.length; i++) {
            if (d === i) continue;
            sd.Link(graph.element(i + 1), graph.element(d + 1))
                .startAnimate().pointStoT().endAnimate().arrow();
        }
    }
    await focus(sd.rand(0, pos.length - 1));
})