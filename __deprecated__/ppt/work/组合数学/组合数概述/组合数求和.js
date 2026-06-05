import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const n = 6;

sd.init(() => {
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            grid.insert(i, j);
        }
    }
    grid.forEachElement(element => {
        let flg = 0;
        element.onClick(() => {
            sd.inter(async () => {
                flg ^= 1;
                element
                    .startAnimate()
                    .color(flg ? C.orange : C.white)
                    .endAnimate();
            });
        });
    });
});

sd.main(async () => {});
