import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const nodes = ["a", "b", "c"];
const graph = new sd.GridGraph(svg).height(150).width(150);

sd.init(() => {
    graph.at(0, 1).newNode("a");
    graph.at(0.5, 1).newNode("b");
    graph.at(1, 1).newNode("c");
    graph.at(0.5, 0).newNode("u");
    link("u", "a");
    link("u", "b");
    link("u", "c");
    graph.element("u", "a").value(new sd.Math(svg, `w_{u,a}`).fontSize(15), R.pointAtPathByRate(0.5, "mx", "my"));
    graph.element("u", "b").value(new sd.Math(svg, `w_{u,b}`).fontSize(15), R.pointAtPathByRate(0.5, "cx", "my"));
    graph.element("u", "c").value(new sd.Math(svg, `w_{u,c}`).fontSize(15), R.pointAtPathByRate(0.5, "mx", "y"));
    for (let i = 0; i < nodes.length; i++) {
        sd.Label(graph.element(nodes[i]), `$dis(${nodes[i]})$`, "rc", 15);
    }
});

sd.main(async () => {
    for (let i = 0; i < nodes.length; i++) {
        const v = graph.element(nodes[i]);
        const e = graph.element("u", nodes[i]);
        await sd.pause();
        e.startAnimate().strokeDashArray([5, 5]).opacity(0.5).endAnimate();
    }
});

function link(u, v) {
    graph.link(u, v);
    graph.element(u, v).arrow();
}
