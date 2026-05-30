import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 5;
const arr = new sd.ValueArray(svg).elementWidth(60);
const math = new sd.Math(svg);

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
    await status((1 << n) - 1);
    await sd.pause();
    const arr = new sd.Array(svg).resize(n + 1).start(1);
    arr.cx(math.cx()).y(math.my() + 30);
    for (let i = arr.end(), j = 0; i >= arr.start(); i--, j++) {
        arr.element(i).childAs(new sd.Text(svg, j).fontSize(10), R.aside("bc", 3));
        arr.element(i).value(0);
    }
    arr.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    arr.startAnimate().value(arr.end(), 1).endAnimate();
    await sd.pause();
    arr.startAnimate();
    const v1 = arr.dropValue(arr.end());
    arr.value(arr.start(), v1.onEnter(EN.moveTo()));
    arr.value(arr.end(), 0);
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    for (let i = arr.start(); i <= arr.end(); i++) arr.value(i, arr.intValue(i) ^ 1);
    arr.endAnimate();
});

async function status(S) {
    await sd.pause();
    let str = "";
    for (let i = 0; i < n; i++) str = String((S >> i) & 1) + str;
    math.startAnimate().text(`(${str})_2`).endAnimate();
    arr.startAnimate();
    for (let i = 0; i < n; i++) {
        if ((S >> i) & 1) arr.color(i, C.green);
        else arr.color(i, C.white);
    }
    arr.endAnimate();
}
