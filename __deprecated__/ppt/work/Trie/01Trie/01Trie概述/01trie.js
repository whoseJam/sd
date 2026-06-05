import * as sd from "@/sd";
import { build01TrieTreeSync } from "../_/Build01TrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const maxl = 3;
const values = [0, 2, 6, 7];
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
const valueTables = new sd.Code(svg);

sd.init(() => {
    const data = values.map(value => numberToString(value));
    build01TrieTreeSync(tree, data, {
        onReachEndOfString(u) {
            tree.element(u).stroke(C.red).strokeWidth(2);
        },
    });
    valueTables.fontSize(30);
    valueTables.mx(tree.x() - 50).y(tree.y());
    values.forEach(name => valueTables.push(`${name}:${numberToString(name)}`));
});

sd.main(async () => {
    for (let i = 1; i <= values.length; i++) await query(i);
});

async function query(i) {
    await sd.pause();
    valueTables.startAnimate().color(i, C.deepSkyBlue).endAnimate();
    const str = numberToString(values[i - 1]);
    await sd.pause();
    let u = 1;
    tree.startAnimate().color(u, C.blue);
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        u = tree.element(u).acch[c];
        tree.color(u, C.blue);
    }
    tree.endAnimate();
    await sd.pause();
    valueTables.startAnimate().color(C.black).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}

function numberToString(v) {
    let ans = "";
    for (let i = 0; i < maxl; i++) {
        const dir = (v >> i) & 1;
        ans = String(dir) + ans;
    }
    return ans;
}
