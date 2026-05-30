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
    }
});

sd.main(async () => {
    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            if (colors[i] === C.red && colors[j] === C.green) {
                await sd.pause();
                arr.startAnimate();
                for (let k = 0; k < colors.length; k++) arr.value(k).opacity(0);
                arr.value(i).opacity(1);
                arr.value(j).opacity(1);
                arr.endAnimate();
            }
        }
    }
});
