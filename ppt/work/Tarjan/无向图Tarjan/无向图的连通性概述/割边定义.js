import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).scale(0.5);
const links = [
    [3, 6],
    [6, 7],
];
const data = [
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 6],
    [4, 5],
    [4, 6],
    [5, 6],
    [6, 7],
];

sd.init(() => {
    graph.at(0.25, 0).newNode(1);
    graph.at(0.75, 0).newNode(2);
    graph.at(0.5, 0.5).newNode(3);
    graph.at(1, 0.5).newNode(4);
    graph.at(1, 1).newNode(5);
    graph.at(0.5, 1).newNode(6);
    graph.at(0, 1).newNode(7);
    data.forEach(link => {
        graph.newLink(link[0], link[1]);
    });
});

sd.main(async () => {
    for (let i = 0; i < links.length; i++) {
        await sd.pause();
        graph.startAnimate();
        graph.element(links[i][0], links[i][1]).color(C.red).strokeWidth(3);
        if (i >= 1)
            graph
                .element(links[i - 1][0], links[i - 1][1])
                .color(C.black)
                .strokeWidth(1);
        graph.endAnimate();
    }
    await sd.pause();
    graph
        .element(links[links.length - 1][0], links[links.length - 1][1])
        .startAnimate()
        .color(C.black)
        .strokeWidth(1)
        .endAnimate();
    graph.forEachNode(node => {
        let selected = false;
        node.onClick(() => {
            sd.inter(async () => {
                node.startAnimate()
                    .color(selected ? C.white : C.orange)
                    .endAnimate();
                selected ^= 1;
            });
        });
    });
});
