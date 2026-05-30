import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(200).width(500).cx(600).cy(300);
const R = sd.rule();
const links = [
    { from: "S", to: "1", cap: "v_1", xloc: "mx", yloc: "my" },
    { from: "1", to: "2", cap: "d_{1,2}", xloc: "mx", yloc: "my" },
    { from: "1", to: "3", cap: "d_{1,3}", xloc: "cx", yloc: "y" },
    { from: "1", to: "4", cap: "d_{1,4}", xloc: "mx", yloc: "y" },
    { from: "2", to: "T", cap: "-v_2", xloc: "x", yloc: "my" },
    { from: "3", to: "T", cap: "-v_3", xloc: "cx", yloc: "y" },
    { from: "4", to: "T", cap: "-v_4", xloc: "x", yloc: "y" },
];

sd.init(() => {
    graph.at(0.5, 0).newNode("S");
    graph.at(0.5, 0.33).newNode("1");
    graph.at(0, 0.66).newNode("2");
    graph.at(0.5, 0.66).newNode("3");
    graph.at(1, 0.66).newNode("4");
    graph.at(0.5, 1).newNode("T");
    links.forEach(link => {
        graph.link(link.from, link.to);
        const e = graph.element(link.from, link.to).arrow();
        const math = new sd.Math(e, link.cap);
        e.value(math, R.pointAtPathByRate(0.5, link.xloc, link.yloc));
    });
});

sd.main(async () => {});
