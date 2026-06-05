import * as sd from "@/sd";

const svg = sd.svg();
const n = 8;
const m = 4;
const arr = new sd.Array(svg);
const slider = new sd.Slider(svg).min(1).max(8).value(4);
const sliderText = new sd.Text(svg, m);
sd.Aside(slider, sliderText, "rc");
sd.Label(slider, "m", "lc");
slider.onChange(value => {
    sd.inter(async () => {
        await update(value);
    });
});

sd.init(() => {
    arr.resize(n).start(1);
    sd.Brace(arr).brace(1, n, "b").value("n");
    slider
        .width(100)
        .cx(arr.cx())
        .my(arr.y() - 10);
    sliderText.text(m);
    for (let i = 1; i <= n; i++) arr.text(i, ((i - 1) % m) + 1);
});

sd.main(async () => {});

async function update(value) {
    sliderText.startAnimate().text(value).endAnimate();
    arr.startAnimate();
    for (let i = 1; i <= n; i++) arr.text(i, ((i - 1) % value) + 1);
    arr.endAnimate();
}
