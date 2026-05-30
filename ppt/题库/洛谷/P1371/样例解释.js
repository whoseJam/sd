import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).pushArray("NOIOI");

sd.init(() => {
    arr.forEachElement(element => {
        let flag = 0;
        element.onClick(() => {
            sd.inter(async () => {
                element
                    .startAnimate()
                    .color(flag ? C.white : C.blue)
                    .endAnimate();
                flag ^= 1;
            });
        });
    });
});

sd.main(async () => {});
