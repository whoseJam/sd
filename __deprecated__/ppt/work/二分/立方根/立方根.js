import * as sd from "@/sd";

const svg = sd.svg();
const input = new sd.Slider(svg).width(100).min(1).max(8);
const value = new sd.Text(svg, input.value()).x(input.mx() + 20).cy(input.cy());
const tri = new sd.Math(svg, `x^3=?`).cx(input.kx(0.4)).y(input.my() + 20);
sd.Label(input, "x", "lc");

function getTriple(x) {
    return x * x * x;
}

input.onChange(value => {
    sd.inter(async () => {
        await update(value);
    });
});

sd.init(() => {});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update(input.value());
});

async function update(v) {
    value.startAnimate().text(v).endAnimate();
    tri.startAnimate()
        .text(`x^3=${getTriple(v)}`, { "x^3=": "x^3=" })
        .endAnimate();
}
