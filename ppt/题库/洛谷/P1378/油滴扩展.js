import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const X = 50;
const Y = -20;
const MX = 200;
const MY = 60;
const data = [
    [65, 15],
    [85, 35],
    [80, 10],
    [160, 40],
    [150, 30],
];
const n = data.length;
const nodes = [];
new sd.Rect(svg)
    .x(X)
    .y(Y)
    .width(MX - X)
    .height(MY - Y);

function distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

sd.init(() => {
    for (let i = 0; i < n; i++) {
        const [x, y] = data[i];
        nodes.push({
            x,
            y,
            r: 2,
            expanded: false,
            circle: new sd.Circle(svg).color(C.GREEN).r(2).center(x, y),
        });
    }
    nodes.forEach((node, i) => {
        node.circle.onClick(() => {
            if (node.expanded) return;
            sd.inter(() => {
                node.circle.startAnimate();
                node.circle.color(C.ORANGE);
                let r = Infinity;
                r = Math.min(r, node.x - X);
                r = Math.min(r, node.y - Y);
                r = Math.min(r, MX - node.x);
                r = Math.min(r, MY - node.y);
                for (let i = 0; i < n; i++) {
                    if (!nodes[i].expanded) continue;
                    r = Math.min(r, Math.max(distance(node, nodes[i]) - nodes[i].r, 0));
                }
                node.r = r;
                node.circle.r(Math.max(r, 2)).center(node.x, node.y);
                node.circle.endAnimate();
                node.expanded = true;
            });
        });
    });
});

sd.main(async () => {});
