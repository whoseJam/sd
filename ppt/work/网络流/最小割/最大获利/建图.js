import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(200).width(500).cx(600).cy(300);
const R = sd.rule();
const links = [
    { from: "S", to: "用户1", cap: "C_1", xloc: "mx", yloc: "my" },
    { from: "用户1", to: "中转1", cap: "\\infty", xloc: "mx", yloc: "my" },
    { from: "用户1", to: "中转2", cap: "\\infty", xloc: "mx", yloc: "y" },
    { from: "中转1", to: "T", cap: "P_1", xloc: "x", yloc: "my" },
    { from: "中转2", to: "T", cap: "P_2", xloc: "x", yloc: "y" },
];

sd.init(() => {
    graph.at(0.5, 0).newNode("S");
    graph.at(0.5, 0.33).newNode("用户1");
    graph.at(0, 0.66).newNode("中转1");
    graph.at(1, 0.66).newNode("中转2");
    graph.at(0.5, 1).newNode("T");
    links.forEach(link => {
        graph.link(link.from, link.to);
        const e = graph.element(link.from, link.to).arrow();
        const math = new sd.Math(e, link.cap);
        e.value(math, R.pointAtPathByRate(0.5, link.xloc, link.yloc));
    });
});

sd.main(async () => {});
