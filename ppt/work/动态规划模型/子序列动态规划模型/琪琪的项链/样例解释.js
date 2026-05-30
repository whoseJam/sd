import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colors = [C.red, C.red, C.blue, C.green, C.green, C.red, C.green, C.green, C.red, C.red, C.red, C.red];
const arr = new sd.Array(svg).resize(colors.length);

sd.init(() => {
    for (let i = 0; i < colors.length; i++) {
        arr.color(i, colors[i]);
        arr.value(i, "✔");
        arr.value(i).opacity(0);
        let tmp = 0;
        arr.element(i).onClick(() => {
            sd.inter(async () => {
                const value = arr.value(i);
                value
                    .startAnimate()
                    .opacity((tmp = tmp ^ 1))
                    .endAnimate();
            });
        });
    }
});

sd.main(async () => {});
