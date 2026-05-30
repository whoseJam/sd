import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const rationals = [];
let n = 20;
const H = 70;

const slider = new sd.Slider(svg)
    .min(5)
    .max(20)
    .value(20)
    .width(300)
    .cx(8.5 * 40)
    .my(-10);
sd.Label(slider, "n", "lc");
const label = sd.Label(slider, "20", "rc");
slider.onChange(value => label.text((n = value)));

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        rationals.push(new sd.Math(svg, `\\frac{{${i}}}{{${n}}}`).cx(i * 40));
    }
    await sd.pause();
    const S = new Set();
    for (let i = 1; i <= n; i++) {
        const d = getGCD(i, n);
        rationals[i - 1]
            .startAnimate()
            .transformMath(`\\frac{{${i / d}}}{{${n / d}}}`, { 1: 1, 2: 2 })
            .cx(i * 40)
            .endAnimate();
        S.add(n / d);
    }
    const rank = [...S];
    const cur = sd.make1d(rank.length + 5, 0);
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const d = getGCD(i, n);
        const idx = rank.indexOf(n / d);
        rationals[i - 1]
            .startAnimate()
            .cx(++cur[idx] * 40)
            .y(idx * H)
            .endAnimate();
    }
    const underline = new sd.Line(svg).stroke(C.red).strokeWidth(2).opacity(0);
    const h = rationals[0].height() + 10;
    for (let i = 0; i < rank.length; i++) {
        await sd.pause();
        underline
            .opacity(1)
            .source([20, i * H + h])
            .target([cur[i] * 40 + 20, i * H + h])
            .startAnimate()
            .pointStoT()
            .endAnimate();
        const math = new sd.Math(svg, `\\varphi(${rank[i]})`)
            .mx(-10)
            .cy(i * H + h / 2)
            .opacity(0)
            .after(underline)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        underline.after(math).startAnimate().fadeStoT().endAnimate().opacity(0);
    }
});

function getGCD(a, b) {
    if (!b) return a;
    return getGCD(b, a % b);
}
