import * as sd from "@/sd";

const svg = sd.svg();
const L = 100;
const g = new sd.GridGraph(svg).width(L).height((L * Math.sqrt(3)) / 2);
const links = [
    [1, 3],
    [2, 1],
    [2, 4],
    [3, 2],
    [4, 3],
    [4, 5],
    [4, 6],
    [6, 7],
    [7, 5],
];

sd.init(() => {
    g.at(1, 0).newNode(1);
    g.at(0, 0.5).newNode(2);
    g.at(1, 1).newNode(3);
    g.at(0, 1.5).newNode(4);
    g.at(1, 2).newNode(5);
    g.at(0, 2.5).newNode(6);
    g.at(1, 3).newNode(7);

    links.forEach(link => {
        g.newLink(link[0], link[1]);
        g.element(link[0], link[1]).arrow();
    });
    g.forEachNode(node => {
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

sd.main(async () => {});
