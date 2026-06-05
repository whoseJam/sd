import * as sd from "@/sd";

const svg = sd.svg();
const r1 = new sd.Rect(svg);
const r2 = new sd.Rect(svg).dy(50);
const r3 = new sd.Rect(svg).dy(100);
const r4 = new sd.Rect(svg).dy(150);
const r5 = new sd.Rect(svg).dy(200);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    r1.startAnimate().dx(500).endAnimate();
    r2.startAnimate(600).dx(500).endAnimate();
    r3.startAnimate(900).dx(500).endAnimate();
    r4.startAnimate(1200).dx(500).endAnimate();
    r5.startAnimate(1500).dx(500).endAnimate();
});
