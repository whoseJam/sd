import * as sd from "@/sd";
import { XorLinearSetPure } from "../_/XorLinearSetPure";

const svg = sd.svg();
const R = sd.rule();
const seq = [7, 2, 3, 4];
const sets = [];
const n = 4;
const arr = new sd.Array(svg).elementWidth(80);
seq.map(v => math(v)).forEach(m => {
    arr.push();
    arr.lastElement().value(m, R.center());
});

sd.init(() => {
    for (let i = 0; i < seq.length; i++) {
        const set = i === 0 ? new XorLinearSetPure(n) : sets[sets.length - 1].clone();
        set.insertWithPos(seq[i], i);
        sets.push(set);
    }
    arr.forEachElement((element, i) => {
        const box = sd.Aside(element, new sd.Box(svg, new sd.Math(svg, `L_{${i + 1}}`)).width(30).height(15), "tc", 30);
        box.onClick(() => {
            sd.inter(async () => {
                const links = [];
                for (let j = 0; j < n; j++) {
                    if (sets[i].set[j]) {
                        links.push(
                            sd
                                .Link(box, arr.element(sets[i].pos[j]), sd.Line, "cx", "my", "cx", "y")
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
