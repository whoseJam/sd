import * as sd from "@/sd";

const svg = sd.svg();
const r1 = new sd.Rect(svg);
const r2 = new sd.Rect(svg).x(100);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    r1.startAnimate().dx(60).endAnimate();
    r2.after(r1).startAnimate().dx(60).endAnimate();
});
