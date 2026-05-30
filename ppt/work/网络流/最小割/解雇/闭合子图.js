import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.TinyGraph(svg).width(200).height(200).cx(600).cy(300);

sd.init(() => {
    graph.newNode(1).newNode(2).newNode(3).newNode(4);
    function link(x, y) {
        graph.newLink(x, y);
        graph.element(x, y).arrow();
    }
    link(1, 3);
    link(1, 4);
    link(2, 4);
});

sd.main(async () => {});
