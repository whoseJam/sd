import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const nodes = ["a", "b", "c"];
const graph = new sd.DAG(svg).height(150).width(150);
const links = [
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 3],
    [4, 5],
    [4, 6],
    [6, 5],
];
const path = [1, 4, 6, 5];

sd.init(() => {
    links.forEach(([x, y]) => {
        graph.link(x, y);
        graph.element(x, y).arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    const pen = new sd.PathPen();
    pen.MoveTo(graph.element(path[0]).center());
    for (let i = 1; i < path.length; i++) {
        pen.LineTo(graph.element(path[i]).center());
    }
    const path_ = new sd.Path(svg)
        .d(pen.toString())
        .stroke(C.textBlue)
        .strokeWidth(3)
        .startAnimate(300 * path.length)
        .pointStoT()
        .endAnimate()
        .arrow();
});
