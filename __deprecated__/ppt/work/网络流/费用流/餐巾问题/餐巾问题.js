import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);

sd.init(() => {
    graph.at(0, 0.5).newNode("S");

    graph.at(0.33, 0).newNode("1");
    graph.at(0.33, 0.25).newNode("2");
    graph.at(0.33, 0.5).newNode("3");
    graph.at(0.33, 0.75).newNode("4");
    graph.at(0.33, 1).newNode("5");

    graph.at(0.66, 0).newNode("1'");
    graph.at(0.66, 0.25).newNode("2'");
    graph.at(0.66, 0.5).newNode("3'");
    graph.at(0.66, 0.75).newNode("4'");
    graph.at(0.66, 1).newNode("5'");

    graph.at(1, 0.5).newNode("T");

    function link(u, v, value, xloc, yloc, col = C.black) {
        graph.newLink(u, v);
        graph.element(u, v).arrow().stroke(col).value(value, R.pointAtPathByRate(0.5, xloc, yloc));
    }
    function simpleLink(u, v) {
        graph.newLink(u, v);
        graph.element(u, v).arrow();
    }

    link("S", "3", "R/0", "x", "cy");
    link("3'", "T", "R/0", "x", "cy");
    link("3", "4'", "inf/f", "mx", "y", C.red);
    link("3", "5'", "inf/s", "x", "my", C.deepSkyBlue);

    simpleLink("1'", "2'");
    simpleLink("2'", "3'");
    simpleLink("3'", "4'");
    simpleLink("4'", "5'");

    graph.linkType(sd.Curve);
    link("S", "1'", "inf/p", "mx", "my");
});

sd.main(async () => {});
