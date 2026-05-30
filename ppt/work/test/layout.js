import * as sd from "@/sd";

const svg = sd.svg();
const rect = new sd.Rect(svg);

sd.init(() => {
    rect.opacity(0).x(100);
});

sd.main(async () => {
    await sd.pause();
    rect.startAnimate().dx(100).opacity(1).endAnimate();
});
