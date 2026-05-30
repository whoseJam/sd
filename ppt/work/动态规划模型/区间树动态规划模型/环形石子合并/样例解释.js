import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const n = 10;
const nodes = [];

sd.init(() => {
    new sd.Circle(svg).center(0, 0).r(80);
    for (let i = 0; i < n; i++) {
        const pos = V.makeComplex(80, ((Math.PI * 2) / n) * i);
        nodes.push(new sd.Circle(svg).center(pos).color(C.grey));
    }
    nodes.forEach(node => {
        node.onClick(() => {
            if (nodes.length === 6) return;
            sd.inter(() => {
                const id = nodes.indexOf(node);
                const merge = nodes[(id + 1) % nodes.length];
                nodes.splice(id, 1);
                for (let i = 0; i < nodes.length; i++) {
                    const pos = V.makeComplex(80, ((Math.PI * 2) / nodes.length) * i);
                    nodes[i].startAnimate().center(pos).endAnimate();
                }
                node.startAnimate().center(merge.center()).endAnimate().remove();
            });
        });
    });
});

sd.main(async () => {});
