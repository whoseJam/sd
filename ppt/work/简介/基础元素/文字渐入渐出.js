import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const text = new sd.Text(svg, "hello");
    text.opacity(0).startAnimate().dx(20).opacity(1).endAnimate();
    await sd.pause();
    text.startAnimate().opacity(0).dx(20).endAnimate();
});
