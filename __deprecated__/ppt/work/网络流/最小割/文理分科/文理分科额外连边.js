import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);

sd.init(() => {
    graph.at(0.5, 0).newNode("S");

    graph.at(1, 0.66).newNode("u");
    graph.at(1, 0.33).newNode("Au");

    graph.at(0, 0.66).newNode("v1");
    graph.at(0.25, 0.66).newNode("v2");
    graph.at(0.5, 0.66).newNode("v3");
    graph.at(0.75, 0.66).newNode("v4");

    graph.at(0.5, 1).newNode("T");
    function link(u, v, value, xloc, yloc) {
        graph.newLink(u, v);
        graph.element(u, v).arrow().value(value, R.pointAtPathByRate(0.5, xloc, yloc));
    }
    function linkWithColor(u, v, color) {
        graph.newLink(u, v);
        graph.element(u, v).arrow().stroke(color);
    }

    linkWithColor("S", "v1", C.red);
    linkWithColor("v1", "T", C.deepSkyBlue);
    linkWithColor("S", "v2", C.red);
    linkWithColor("v2", "T", C.deepSkyBlue);
    linkWithColor("S", "v3", C.red);
    linkWithColor("v3", "T", C.deepSkyBlue);
    linkWithColor("S", "v4", C.red);
    linkWithColor("v4", "T", C.deepSkyBlue);
    linkWithColor("S", "u", C.red);
    linkWithColor("u", "T", C.deepSkyBlue);
    link("S", "Au", "sa", "mx", "y");
    link("Au", "u", "inf", "cx", "y");
    link("Au", "v1");
    link("Au", "v2");
    link("Au", "v3");
    link("Au", "v4");
});

sd.main(async () => {});
