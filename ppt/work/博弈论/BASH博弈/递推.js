import * as sd from "@/sd";

let m = 3;

const svg = sd.svg();
const C = sd.color();
const n = 15;
const F = new sd.Array(svg).resize(n).start(1);
const slider = new sd.Slider(svg)
    .cx(F.cx())
    .my(F.y() - 30)
    .min(3)
    .max(5)
    .value(3);
const text = new sd.Text(svg, "m=3");
sd.Aside(slider, text, "rc", 10);
slider.onChange(value => {
    sd.inter(async () => {
        m = +value;
        text.text(`m=${value}`);
    });
});

sd.init(() => {
    sd.Index(F, "t");
});

sd.main(async () => {
    const brace = sd.Brace(F);

    await sd.pause();
    F.startAnimate();
    for (let i = 1; i <= m; i++) {
        F.value(i, 1);
    }
    F.endAnimate();

    for (let i = m + 1; i <= n; i++) {
        await sd.pause(sd.CONTINUE_STAGE);
        F.startAnimate().color(i, C.blue).endAnimate();
        await sd.pause(sd.CONTINUE_STAGE);
        brace
            .startAnimate()
            .brace(i - m, i - 1, "b")
            .endAnimate();
        let flag = false;
        for (let j = i - m; j <= i - 1; j++) {
            flag |= F.intValue(j) === 0;
        }

        await sd.pause(sd.CONTINUE_STAGE);
        F.startAnimate()
            .value(i, flag ? 1 : 0)
            .endAnimate();
        await sd.pause(sd.CONTINUE_STAGE);
        brace.startAnimate().opacity(0).endAnimate();
        F.startAnimate().color(i, C.white).endAnimate();
    }
});
