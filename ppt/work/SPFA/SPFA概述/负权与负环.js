import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).width(90).height(90);

sd.init(() => {
    function link(a, b, w, xloc, yloc) {
        graph.link(a, b);
        graph.element(a, b).arrow().value(w, R.pointAtPathByRate(0.5, xloc, yloc));
    }
    graph.at(0, 0).newNode(1);
    graph.at(1, 0).newNode(2);
    graph.at(1, 1).newNode(3);
    graph.at(0, 1).newNode(4);
    link(1, 2, 3, "mx", "cy");
    link(2, 3, -4, "cx", "y");
    link(3, 4, 6, "x", "cy");
    link(4, 1, -2, "cx", "my");
})

sd.main(async () => {

})
