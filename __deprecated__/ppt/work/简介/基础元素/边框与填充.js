import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(async () => {
    const rect = new sd.Rect(svg).width(60).height(60);
    await sd.pause();
    rect.startAnimate().strokeWidth(3).endAnimate();
    await sd.pause();
    rect.startAnimate().fill(C.red).stroke(C.textBlue).endAnimate();
    await sd.pause();
    rect.startAnimate().strokeDashArray([5, 5]).endAnimate();
    await sd.pause();
    rect.startAnimate().strokeDashOffset(20).endAnimate();
});
