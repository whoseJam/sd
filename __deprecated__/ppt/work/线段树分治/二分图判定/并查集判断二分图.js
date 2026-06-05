import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const bi = new sd.BipartiteGraph(svg).height(150);
const grid = new sd.GridGraph(svg).width(150).height(150);
const colors = [C.blue, C.green, C.red, C.grey, C.yellow];
let current = 0;

sd.init(() => {
    bi.x(grid.mx() + 100).cy(grid.cy());
    grid.at(0, 0).newNode(1);
    grid.at(0, 1).newNode(2);
    grid.at(1, 0).newNode(3);
    grid.at(1, 1).newNode(4);
    for (let i = 1; i <= n; i++) {
        bi.newNode(i, `A${i}`, 0);
        bi.newNode(i + n, `B${i}`, 1);
    }
});

sd.main(async () => {
    await link(1, 2);
    await link(1, 3);
    await link(2, 4);
    await link(3, 4);
    await link(1, 4);
});

async function link(x, y) {
    await sd.pause();
    grid.startAnimate().link(x, y).endAnimate();
    bi.startAnimate();
    bi.link(x, y + n).link(y, x + n);
    const success = colorABlock(x) && colorABlock(y);
    bi.endAnimate();
    if (!success) {
        await sd.pause();
        grid.startAnimate().color(C.red).endAnimate();
    }
    function colorABlock(x) {
        const vis = {};
        const nodes = [];
        const dfs = x => {
            nodes.push(x);
            vis[x] = true;
            bi.forEachOutNode(x, "undirect", (node, id) => {
                if (vis[id]) return;
                dfs(id);
            });
        };
        dfs(x);
        let color = undefined;
        const colorSet = new Set([]);
        nodes.forEach(node => {
            if (bi.color(node).fill !== C.white) {
                color = bi.color(node).fill;
                colorSet.add(color);
            }
        });
        if (colorSet.size >= 2) return false;
        color = color || colors[current++];
        nodes.forEach(node => {
            bi.color(node, color);
        });
        return true;
    }
}
