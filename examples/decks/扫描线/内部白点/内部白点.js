import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const data = [
    { x: 3, y: 1 },
    { x: 7, y: 2 },
    { x: 2, y: 3 },
    { x: 4, y: 3 },
    { x: 1, y: 4 },
    { x: 5, y: 4 },
    { x: 9, y: 4 },
    { x: 7, y: 5 },
    { x: 3, y: 6 },
    { x: 6, y: 6 },
    { x: 8, y: 6 },
];
const coord = new sd.FixGapCoord(svg).withTickLabel("x", false).ticks("y", 7);
const grad = C.gradient(C.white, C.textBlue, 0, 1);
const arr = new sd.Array(svg)
    .x(coord.x())
    .y(coord.my() + 10)
    .resize(9)
    .opacity(0)
    .elementWidth(30)
    .elementHeight(30)
    .dx(15);
const nodes = [];
const segment = sd.make1d(100, 0);

sd.init(() => {
    data.forEach(item => {
        item.dot = coord.drawCircle(item.x, item.y, 5).color(C.black);
    });
});

sd.main(async () => {
    await sd.pause();
    data.sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && data[r + 1].y === data[l].y) r++;
        if (l < r) {
            sd.Link(data[l].dot, data[r].dot).opacity(0.2).startAnimate().pointStoT().endAnimate();
            nodes.push({
                y: data[l].y,
                l: data[l].x,
                r: data[r].x,
                type: 0,
            });
        }
    }

    await sd.pause();
    data.sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        return a.y - b.y;
    });
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && data[r + 1].x === data[l].x) r++;
        if (l < r) {
            sd.Link(data[l].dot, data[r].dot).opacity(0.2).startAnimate().pointStoT().endAnimate();
            console.log(data[l], data[r]);
            nodes.push({
                x: data[l].x,
                y: data[l].y,
                type: +1,
            });
            const last = nodes[nodes.length - 1];
            nodes.push({
                x: data[r].x,
                y: data[r].y,
                type: -1,
                ref: last,
            });
        }
    }

    await sd.pause();
    nodes.sort(function (a, b) {
        if (a.y !== b.y) return a.y - b.y;
        return a.type - b.type;
    });
    const line = new sd.Line(svg).stroke(C.red).strokeWidth(2).source(coord.pos("x", "my")).target(coord.pos("mx", "my")).opacity(0).startAnimate().opacity(1).endAnimate();
    arr.startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < nodes.length; i++) {
        await sd.pause();
        const node = nodes[i];
        line.startAnimate().y(coord.globalY(node.y)).endAnimate();
        if (node.type === 1) {
            await sd.pause();
            node.dot = new sd.Circle(svg).r(3).color(C.deepSkyBlue);
            line.startAnimate()
                .childAs(`dot_${i}`, node.dot, (parent, child) => {
                    child.center(coord.globalX(node.x), parent.cy());
                })
                .endAnimate();
            segment[node.x - 1]++;
            arr.startAnimate()
                .color(node.x - 1, grad(segment[node.x - 1]))
                .endAnimate();
        } else if (node.type === -1) {
            await sd.pause();
            node.ref.dot.startAnimate().opacity(0).remove();
            segment[node.x - 1]--;
            arr.startAnimate()
                .color(node.x - 1, grad(segment[node.x - 1]))
                .endAnimate();
        } else if (node.type === 0) {
            await sd.pause();
            const brace = new sd.BraceCurve(svg);
            brace.source(arr.element(node.r - 1).mx(), arr.my());
            brace.target(arr.element(node.l - 1).x(), arr.my());
            brace.startAnimate().pointTtoS().endAnimate();
            await sd.pause();
            brace.startAnimate().opacity(0).endAnimate().remove();
        }
    }
});
