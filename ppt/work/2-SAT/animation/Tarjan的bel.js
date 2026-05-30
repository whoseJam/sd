import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.ValueGridGraph(svg).width(400).height(200);
let tot = 0;

sd.init(() => {
    graph.at(0.5, 0).newNode(1, makeTinyGraph(sd.rand(3, 4)));
    graph.at(0, 0.5).newNode(2, makeTinyGraph(sd.rand(3, 4)));
    graph.at(1, 0.5).newNode(3, makeTinyGraph(sd.rand(3, 4)));
    graph.at(0.5, 1).newNode(4, makeTinyGraph(sd.rand(3, 4)));
    function link(a, b) {
        graph.link(a, b);
        graph.element(a, b).arrow();
    }
    link(1, 2);
    link(2, 3);
    link(2, 4);
    link(3, 4);
});

sd.main(async () => {
    await sd.pause();
    sd.Label(graph.element(4), "bel=1", "rc");
    sd.Label(graph.element(3), "bel=2", "lc");
    sd.Label(graph.element(2), "bel=3", "lc");
    sd.Label(graph.element(1), "bel=4", "lc");
});

function makeTinyGraph(n) {
    const tiny = new sd.TinyGraph(svg).width(100).height(100);
    tiny.freeze();
    function link(a, b) {
        tiny.newLink(a, b);
        tiny.element(a, b).arrow();
    }
    for (let i = 0; i < n; i++) {
        tiny.newNode(++tot);
        tiny.element(tot).r(15);
        if (i > 0) link(tot - 1, tot);
        if (i === n - 1) link(tot, tot - n + 1);
    }
    tiny.unfreeze();
    return tiny;
}
