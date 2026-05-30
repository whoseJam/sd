import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).n(6).m(6);
let e1, e2;

sd.init(() => {
    grid.forEachElement((element, i, j) => {
        element.onClick(() => {
            if (!e1) e1 = element;
            else if (!e2) e2 = element;
            if (e1 && e2) {
                sd.inter(async () => {
                    const x = Math.min(e1.x(), e2.x());
                    const y = Math.min(e1.y(), e2.y());
                    const mx = Math.max(e1.mx(), e2.mx());
                    const my = Math.max(e1.my(), e2.my());
                    const rect = new sd.Rect(svg).color(C.BLUE);
                    rect.x(x).y(y).width(mx - x).height(my - y).opacity(0).startAnimate().opacity(1).endAnimate();
                    e1 = e2 = undefined;
                })
            }
        })
    })
});

sd.main(async () => {});