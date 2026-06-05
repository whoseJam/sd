import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.GridGraph(svg).width(200).height(200).cx(200);
const bi = new sd.BipartiteGraph(svg).width(400).height(200).cx(200);
const n = 7;
const links = [
    [1, 2],
    [1, 3],
    [2, 5],
    [3, 4],
    [3, 5],
    [3, 7],
    [5, 6],
    [6, 7],
];

sd.init(() => {
    grid.at(0.25, 0).newNode(1);
    grid.at(0, 0.5).newNode(2);
    grid.at(0.5, 0.5).newNode(3);
    grid.at(0.25, 1).newNode(4);
    grid.at(0.75, 1).newNode(5);
    grid.at(1, 0.5).newNode(6);
    grid.at(0.75, 0).newNode(7);
    links.forEach(link => grid.link(link[0], link[1]));
});

sd.main(async () => {
    await sd.pause();
    grid.startAnimate();
    Dfs(1, C.blue);
    grid.endAnimate();
    await sd.pause();
    grid.uneffectAll();
    bi.startAnimate().freeze();
    for (let i = 1; i <= n; i++) bi.newNodeFromExistElement(i, grid.element(i), grid.color(i).fill === C.blue ? 0 : 1);
    links.forEach(link => {
        bi.newLinkFromExistElement(link[0], link[1], grid.element(link[0], link[1]));
    });
    bi.unfreeze().endAnimate();
});

function Dfs(u, color) {
    if (grid.color(u).fill !== C.white) return;
    grid.color(u, color);
    for (let link of grid.outLinks(u)) {
        if (color === C.blue) Dfs(grid.toNodeId(link, u), C.green);
        else Dfs(grid.toNodeId(link, u), C.blue);
    }
}
