import * as sd from "@/sd";
import { XorLinearSetPure } from "../_/XorLinearSetPure";

const svg = sd.svg();
const R = sd.rule();
const sets = [];
const n = 4;
const tree = new sd.BoxTree(svg).elementWidth(80).layerHeight(80).width(500);
const seq = [7, 2, 3, 4, 5, 3];
const links = [
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 5],
    [4, 6],
];

sd.init(() => {
    seq.forEach((value, i) => {
        tree.newNode(i);
        tree.element(i).value(math(value), R.center());
    });
    links.forEach(link => {
        tree.link(link[0] - 1, link[1] - 1);
    });
    for (let i = 0; i < seq.length; i++) {
        const fa = +tree.fatherId(i);
        const set = isNaN(fa) ? new XorLinearSetPure(n) : sets[fa].clone();
        set.insertWithPos(seq[i], tree.depth(i));
        sets.push(set);
    }
    tree.forEachNode((node, i) => {
        const box = sd.Aside(node, new sd.Box(svg, new sd.Math(svg, `L_{${+i + 1}}`)).width(30).height(15), "tc", 10);
        box.onClick(() => {
            sd.inter(async () => {
                const links = [];
                for (let j = 0; j < n; j++) {
                    if (sets[i].set[j]) {
                        const depth = sets[i].pos[j];
                        const target = tree.ancestor(node, tree.depth(node) - depth);
                        links.push(
                            sd
                                .Link(box, target, sd.Curve, "cx", "my", "cx", "y")
                                .startAnimate()
                                .pointStoT()
                                .endAnimate()
                                .arrow()
                        );
                    }
                }
                await sd.pause();
                links.forEach(link => {
                    link.startAnimate().fadeStoT().endAnimate().remove();
                });
            });
        });
    });
});

sd.main(async () => {});

function math(v) {
    return new sd.Math(svg, castBinToStr(v));
}

function castBinToStr(v) {
    let ans = "";
    for (let i = n; i >= 1; i--) ans = ans + String((v >> (i - 1)) & 1);
    return ans;
}
