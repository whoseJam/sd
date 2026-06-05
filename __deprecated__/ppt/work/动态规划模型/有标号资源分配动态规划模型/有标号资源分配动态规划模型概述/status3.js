import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 5;
const S = 0b10110;
const r = 3;
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
    await status(S);
    await sd.pause();
    arr.startAnimate().color(r, C.blue).endAnimate();
    math.startAnimate()
        .text(`(${castToBinStr(S ^ (1 << r))})_2`)
        .endAnimate();
    await sd.pause();
    const bin = new sd.Array(svg).resize(n).start(1);
    bin.cx(math.cx()).y(math.my() + 30);
    for (let i = bin.end(), j = 0; i >= bin.start(); i--, j++) {
        bin.element(i).childAs(new sd.Text(svg, j).fontSize(10), R.aside("bc", 3));
        bin.element(i).value((S >> j) & 1);
    }
    bin.opacity(0).startAnimate().opacity(1).endAnimate();

    await sd.pause();
    const sol = new sd.Array(svg)
        .resize(n)
        .start(1)
        .cx(arr.cx())
        .y(bin.my() + 30);
    for (let i = sol.start(); i <= sol.end(); i++) sol.value(i, 0);
    sol.value(sol.end() - r, 1)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
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

function castToBinStr(S) {
    let str = "";
    for (let i = 0; i < n; i++) str = String((S >> i) & 1) + str;
    return str;
}
