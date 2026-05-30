import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).width(800);

sd.init(() => {
    function link(u, v, value, xloc, yloc, col = C.black) {
        graph.newLink(u, v);
        graph.element(u, v).arrow().stroke(col).value(value, R.pointAtPathByRate(0.5, xloc, yloc));
    }
    graph.at(0, 0.5).newNode("S");
    graph.at(1, 0.5).newNode("T");
    for (let i = 1; i <= 5; i++) {
        graph.at(0.33, (1 / 4) * (i - 1)).newNode(`C${i}`);
        link("S", `C${i}`, `A${i}/0`, "mx", "cy");
    }
    for (let i = 1; i <= 4; i++) {
        graph.at(0.66, (1 / 3) * (i - 1)).newNode(`S${i}`);
        link(`S${i}`, "T", `B${i}/0`, "mx", "cy");
    }
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 4; j++) {
            link(`C${i}`, `S${j}`, null, "cx", "cy", C.red);
        }
    }
    sd.MathLabel(graph, "+\\infty/c_{i,j}", "rc", 20);
});

sd.main(async () => {});
