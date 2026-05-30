import * as sd from "@/sd";

const svg = sd.svg();
const axis = new sd.Axis(svg).tickAlign("source");
const i = 6;
const j = 3;

sd.init(() => {
    const circle = new sd.Circle(svg).r(5).center(axis.global(i + 0.5));
    sd.Pointer(circle, "i", "t").moveTo(circle);
});

sd.main(async () => {
    await sd.pause();
    const circle = new sd.Circle(svg).r(5).center(axis.global(j + 0.5));
    sd.Pointer(circle, "j", "t").moveTo(circle);
    circle.opacity(0).startAnimate().opacity(1).endAnimate();
});
