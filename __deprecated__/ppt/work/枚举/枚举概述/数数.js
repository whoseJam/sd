import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const colors = [C.red, C.green, C.blue];
const array = new sd.ValueArray(svg).elementWidth(60);
const randomColors = [];

sd.init(() => {
    for (let i = 1; i <= n; i++) randomColors.push(sd.rand(0, colors.length - 1));
    let redCount = 0;
    for (let i = 0; i < n; i++) if (randomColors[i] === 0) redCount++;
    if (redCount === 0) for (let i = 1; i <= 3; i++) randomColors[sd.rand(0, randomColors.length - 1)] = 0;
    for (let i = 0; i < n; i++) array.push(new sd.Circle(svg).color(colors[randomColors[i]]));
});

sd.main(async () => {
    await sd.pause();
    const focus = sd.Focus(array).stroke(C.black).strokeWidth(1).gap(10).startAnimate().focus().endAnimate();
    sd.Label(focus, "样本空间", "tc");
});
