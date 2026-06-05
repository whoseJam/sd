import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).width(200).height(100);

init();
main();

function init() {
    graph.at(0, 0).newNode("S");
    graph.at(0, 1).newNode("v");
    graph.at(1, 0.5).newNode("u");
    function link(u, v) {
        graph.newLink(u, v);
        return graph.element(u, v).arrow();
    }
    function math(math) {
        return new sd.Math(svg, math);
    }
    link("S", "v").strokeDashArray([5, 5]).value(math("dis(v)"), R.pointAtPathByRate(0.5, "cx", "my"));
    link("S", "u").strokeDashArray([5, 5]).value(math("dis(u)"), R.pointAtPathByRate(0.5, "mx", "y"));
    link("u", "v").value(math("w(u, v)"), R.pointAtPathByRate(0.5, "x", "y"));
}

async function main() {
    await sd.pause();
}
