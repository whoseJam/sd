import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const heights = [1, 2, 1, 4, 5, 3, 1, 4, 2];
const n = heights.length;
let towers = [];

sd.init(() => {
    for (let i = 0; i < n; i++) {
        const rect = new sd.Rect(svg);
        rect.width(20)
            .height(heights[i] * 20)
            .x(i * 40)
            .my(300)
            .color(C.random());
        towers.push([rect]);
        rect.onClick(() => {
            sd.inter(async () => {
                const index = towers.findIndex(tower => tower.includes(rect));
                if (index < towers.length - 1) {
                    const currentTower = towers[index];
                    const nextTower = towers[index + 1];
                    currentTower.forEach((r, idx) => {
                        const y = idx > 0 ? currentTower[idx - 1].y() : nextTower[nextTower.length - 1].y();
                        r.startAnimate().my(y).endAnimate();
                    });
                    nextTower.push(...currentTower);
                    towers.splice(index, 1);
                    towers.forEach((tower, i) => {
                        tower.forEach(r => {
                            r.startAnimate()
                                .x(i * 40)
                                .endAnimate();
                        });
                    });
                }
            });
        });
    }
});

sd.main(async () => {});
