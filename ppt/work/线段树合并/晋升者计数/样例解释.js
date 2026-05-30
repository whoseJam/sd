import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).x(100).width(400).layerHeight(80);
const n = 5;
const power = [4, 2, 1, 3, 5];
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
];

sd.init(() => {
    power.forEach((p, id) => {
        tree.newNode(id + 1, p);
    });
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        let cnt = 0;
        const myPower = tree.intValue(i);
        tree.forEachNodeInSubtree(i, node => {
            const power = node.intValue();
            if (power > myPower) cnt++;
        });
        await sd.pause();
        sd.Label(tree.element(i), `cnt=${cnt}`, "tc", 15, 1).opacity(0).startAnimate().opacity(1).endAnimate();
    }
});
