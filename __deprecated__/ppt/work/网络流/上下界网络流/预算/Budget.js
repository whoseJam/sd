import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);

sd.init(() => {
    graph.at(0, 0.5).newNode("S");
    graph.at(0.33, 0).newNode("R1");
    graph.at(0.33, 0.33).newNode("R2");
    graph.at(0.33, 0.66).newNode("R3");
    graph.at(0.33, 1).newNode("R4");
    graph.at(0.66, 0).newNode("C1");
    graph.at(0.66, 0.5).newNode("C2");
    graph.at(0.66, 1).newNode("C3");
    graph.at(1, 0.5).newNode("T");
    function link(u, v) {
        graph.newLink(u, v);
        graph.element(u, v).arrow();
    }
    for (let i = 1; i <= 4; i++) {
        link("S", `R${i}`);
    }
    for (let i = 1; i <= 3; i++) {
        link(`C${i}`, "T");
    }
});

sd.main(async () => {
    await sd.pause();
    graph.element("S", "R2").startAnimate().value("V/V").endAnimate();
    await sd.pause();
    graph.startAnimate();
    const label = ["3/5", "0/inf", "3/20"];
    for (let i = 1; i <= 3; i++) {
        graph.newLink("R2", `C${i}`);
        const link = graph.element("R2", `C${i}`).value(label[i - 1]);
        link.after(0).arrow();
    }
    graph.endAnimate();
});
