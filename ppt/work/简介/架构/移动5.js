import * as sd from "@/sd";

const svg = sd.svg();
const r1 = new sd.Rect(svg);
const r2 = new sd.Rect(svg).dy(50);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    r1.startAnimate(1000).x(500).endAnimate();
    r2.x(500);
});
