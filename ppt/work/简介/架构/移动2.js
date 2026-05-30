import * as sd from "@/sd";

const svg = sd.svg();
const rect = new sd.Rect(svg);

sd.main(async () => {
    await sd.pause();
    rect.startAnimate().x(100).y(100).endAnimate();
});
