import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const rect = new sd.Rect(svg).strokeDashArray([0, 160]).stroke(C.BLUE.border).fillOpacity(0).fill(C.BLUE.main).startAnimate().strokeDashArray([160, 0]).endAnimate().startAnimate().fillOpacity(1).endAnimate();
});
