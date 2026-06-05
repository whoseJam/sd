import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(async () => {
    const rect = new sd.Rect(svg).x(100).y(100);
    const circle = new sd.Circle(svg).x(200).y(100);
    const ellipse = new sd.Ellipse(svg).x(300).y(100);
    const text = new sd.Text(svg, "hello").x(400).y(100);
    await sd.pause();
    ellipse.startAnimate().ry(15).rx(25).endAnimate();
    await sd.pause();
    rect.startAnimate().y(200).endAnimate();
    circle.startAnimate().y(200).endAnimate();
    ellipse.startAnimate().y(200).endAnimate();
    text.startAnimate().y(200).endAnimate();
});
