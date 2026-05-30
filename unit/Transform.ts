import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestTransformOriginInDifferentForm);

async function TestTransformOriginInDifferentForm() {
    const rect = new sd.Rect(svg).x(100).y(100).rotate(30);
    const point = new sd.Circle(svg).r(5).color(C.red).x(100).y(100);
    await sd.pause();
    rect.startAnimate().transformOrigin("center", "top").endAnimate();
    point.center(rect.transformOrigin());
    console.log("at=", rect.transformOrigin());
    await sd.pause();
    rect.startAnimate().transformOrigin("50%", "50%").endAnimate();
    point.center(rect.transformOrigin());
    await sd.pause();
    rect.startAnimate().transformOrigin("center", "top").endAnimate();
    point.center(rect.transformOrigin());
}

async function TestTransformOrigin() {
    const rect = new sd.Rect(svg).x(100).y(100).transformOrigin(120, 120);
    await sd.pause();
    rect.startAnimate().rotate(45).endAnimate();
    rect.startAnimate().scale(2).endAnimate();
}

async function TestRotate() {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    rect.startAnimate().rotate(45).endAnimate();
}

async function TestScale() {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    rect.startAnimate().scale(2, 2).endAnimate();
}

async function TestTranslate() {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    rect.startAnimate().translate(100, 100).endAnimate();
}
