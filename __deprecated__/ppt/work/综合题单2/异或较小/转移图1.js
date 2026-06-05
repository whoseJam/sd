import * as sd from "@/sd";
import { build01TrieTreeSync } from "../_/Build01TrieTreeSync";

const svg = sd.svg();
const V = sd.vec();
const C = sd.color();
const R = sd.rule();
const maxl = 3;
const values = [0, 2, 6, 7, 4, 5];
const str = [0, 1, 0];
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
const trans = new sd.HorizontalValueTree(svg).height(400).layerWidth(120);

sd.init(() => {
    const data = values.map(value => numberToString(value));
    build01TrieTreeSync(tree, data, {
        onReachEndOfString(u) {
            tree.element(u).stroke(C.red).strokeWidth(2);
        },
    });
    trans.x(tree.mx() + 100).cy(tree.cy());
});

sd.main(async () => {
    await sd.pause();
    const m = str.map(v => `{${v}}`).join("");
    const text = new sd.Math(svg, m)
        .fontSize(25)
        .cx(tree.cx())
        .my(tree.y() - 40)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    let current = [[1, 1]];
    trans.startAnimate().root(id(1, 1), math(1, 1)).endAnimate();

    for (let i = 1; i <= str.length; i++) {
        await sd.pause();
        text.startAnimate();
        if (i > 1) text.color(i - 1, C.black);
        text.color(i, C.red);
        text.endAnimate();

        await sd.pause();
        const next = [];
        trans.startAnimate().freeze();
        function insert(x, y, d1, d2) {
            if (d1 === "l") d1 = "left";
            else d1 = "right";
            if (d2 === "l") d2 = "left";
            else d2 = "right";
            const [dx, dy] = [tree[`${d1}Child`](x), tree[`${d2}Child`](y)];
            if (!dx || !dy) return;
            const [nx, ny] = [tree.nodeId(dx), tree.nodeId(dy)];
            trans.newNode(id(nx, ny), math(nx, ny));
            trans.newLink(id(x, y), id(nx, ny));
            next.push([nx, ny]);
        }
        for (let j = 0; j < current.length; j++) {
            const [x, y] = current[j];
            if (str[i - 1] === 0) {
                insert(x, y, "l", "l");
                insert(x, y, "r", "r");
            } else {
                if (x === y) insert(x, y, "l", "r");
                else {
                    insert(x, y, "l", "r");
                    insert(x, y, "r", "l");
                }
            }
        }
        trans.unfreeze().endAnimate();
        current = next;
    }
});

function id(x, y) {
    return `(${x},${y})`;
}

function math(x, y) {
    return new sd.Math(svg, id(x, y));
}

function numberToString(v) {
    let ans = "";
    for (let i = 0; i < maxl; i++) {
        const dir = (v >> i) & 1;
        ans = String(dir) + ans;
    }
    return ans;
}
