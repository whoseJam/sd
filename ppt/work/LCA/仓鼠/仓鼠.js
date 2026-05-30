import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(700);
const n = 12;
const links = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [3, 8],
    [3, 9],
    [4, 10],
    [5, 11],
    [6, 12],
];

sd.init(() => {
    links.forEach(link => tree.link(link[0], link[1]));
});

sd.main(async () => {
    await sd.pause();
    const nodes = unique(4);
    drawPath(nodes[0], nodes[1], C.deepSkyBlue);
    drawPath(nodes[2], nodes[3], C.red);
});

function unique(count) {
    const ans = [];
    function contains(x) {
        for (let i = 0; i < ans.length; i++) if (ans[i] === x) return true;
        return false;
    }
    for (let i = 1; i <= count; i++) {
        while (true) {
            const u = sd.rand(1, n);
            if (!contains(u)) {
                ans.push(u);
                break;
            }
        }
    }
    return ans;
}

function drawPath(u, v, col) {
    while (String(u) !== String(v)) {
        if (tree.depth(u) < tree.depth(v)) {
            let tmp = u;
            u = v;
            v = tmp;
        }
        const fa = tree.fatherId(u);
        drawLink(fa, u, col);
        u = fa;
    }
}

function drawLink(u, v, color) {
    const du = tree.element(u);
    const dv = tree.element(v);
    const dy = color === C.red ? -2 : 2;
    new sd.Line(svg)
        .source([du.cx(), du.cy() + dy])
        .target([dv.cx(), dv.cy() + dy])
        .strokeWidth(3)
        .stroke(color)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
}
