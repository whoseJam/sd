import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const L = [5, 4, 7, 3, 6, 8];
const arrs = [];
for (let i = 0; i < L.length; i++) {
    arrs.push(new sd.Array(svg).resize(L[i]));
    arrs[i].y(60 + i * 60);
}
const input = new sd.Slider(svg)
    .width(100)
    .x(75)
    .min(1)
    .max(8)
    .onChange(value => {
        sd.inter(async () => {
            await update(value);
        });
    });
const length = new sd.Text(svg, input.value()).x(input.mx() + 20).cy(input.cy());
const label = new sd.Text(svg, "count=?").x(length.mx() + 20).cy(input.cy());
sd.Label(input, "length", "lc");

sd.init(() => {});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update(input.value());
});

async function update(value) {
    length.startAnimate().text(value).endAnimate();
    let ans = 0;
    for (let i = 0; i < L.length; i++) {
        arrs[i].startAnimate();
        arrs[i].color(C.white);
        ans += Math.floor(L[i] / value);
        for (let j = 0; (j + 1) * value <= arrs[i].length(); j++) {
            for (let k = j * value; k < (j + 1) * value; k++) {
                if (j & 1) arrs[i].color(k, C.blue);
                else arrs[i].color(k, C.deepSkyBlue);
            }
        }
        arrs[i].endAnimate();
    }
    label.startAnimate().text(`count=${ans}`, { "count=": "count=" }).endAnimate();
}
