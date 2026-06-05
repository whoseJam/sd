import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const m = 10;
const grid = new sd.Grid(svg).n(n).m(m);
let k = 7;
const counter = new sd.Math(svg, k);

sd.init(() => {
    counter.cx(grid.cx()).my(grid.y() - 20);
    grid.forEachElement(element => {
        let flag = 0;
        element.onClick(() => {
            if (flag === 0 && k > 0) {
                sd.inter(async () => {
                    k--;
                    counter.startAnimate().transformMath(k).endAnimate();
                    element.startAnimate().color(C.grey).endAnimate();
                    flag ^= 1;
                });
            } else if (flag === 1) {
                sd.inter(async () => {
                    k++;
                    counter.startAnimate().transformMath(k).endAnimate();
                    element.startAnimate().color(C.white).endAnimate();
                    flag ^= 1;
                });
            }
        });
    });
});

sd.main(async () => {});
