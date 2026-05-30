import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colors = [C.white, C.red, C.textBlue];
const seq = "()";
const arr = new sd.Array(svg).pushArray(seq);

sd.init(() => {
    arr.forEachElement(element => {
        let tmp = 0;
        element.onClick(() => {
            tmp = (tmp + 1) % colors.length;
            sd.inter(async () => {
                element.startAnimate().color(colors[tmp]).endAnimate();
            });
        });
    });
});

sd.main(async () => {});
