import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(200).cx(600).cy(300);
const R = sd.rule();
const links = [
    { from: "S", to: "i", cap: "a_i", xloc: "mx", yloc: "my" },
    { from: "S", to: "j", cap: "a_j", xloc: "mx", yloc: "y" },
    { from: "i", to: "j", cap: "w_{i,j}", xloc: "x", yloc: "cy" },
    { from: "i", to: "T", cap: "b_i", xloc: "x", yloc: "my" },
    { from: "j", to: "T", cap: "b_j", xloc: "x", yloc: "y" },
];

sd.init(() => {
    graph.at(0.5, 0).newNode("S");
    graph.at(0, 0.5).newNode("i");
    graph.at(1, 0.5).newNode("j");
    graph.at(0.5, 1).newNode("T");
    links.forEach(link => {
        graph.link(link.from, link.to);
        const e = graph.element(link.from, link.to).arrow();
        const math = new sd.Math(e, link.cap);
        e.value(math, R.pointAtPathByRate(0.5, link.xloc, link.yloc));
    });
    graph.element("i", "j").doubleArrow();
});

sd.main(async () => {});
