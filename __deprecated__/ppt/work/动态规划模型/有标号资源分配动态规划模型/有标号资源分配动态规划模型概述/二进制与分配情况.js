import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const arr = new sd.ValueArray(svg).elementWidth(60);
const math = new sd.Math(svg, "");

sd.init(() => {
    let str = "";
    for (let i = 1; i <= n; i++) {
        arr.push(new sd.Vertex(arr, i));
        str = "0" + str;
    }
    math.text(`(${str})_2`)
        .cx(arr.cx())
        .y(arr.my() + 30);
});

sd.main(async () => {
    while (true) await status(sd.rand(0, (1 << n) - 1));
});

async function status(S) {
    await sd.pause();
    let str = "";
    for (let i = 0; i < n; i++) str = String((S >> i) & 1) + str;
    math.startAnimate().text(`(${str})_2`).endAnimate();
    await sd.pause();
    arr.startAnimate();
    for (let i = 0; i < n; i++) {
        if ((S >> i) & 1) arr.color(i, C.green);
        else arr.color(i, C.white);
    }
    arr.endAnimate();
}
