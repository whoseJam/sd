import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestStrokeDashArray);

async function TestStrokeDashArray() {
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: C.blue,
        stroke: C.red,
        strokeWidth: 3,
        strokeDashArray: 1000,
    });
    await sd.pause();
    rect.startAnimate().setStrokeDashArray([10, 10]).endAnimate();
    await sd.pause();
    rect.startAnimate().setStrokeDashArray([10, 0]).endAnimate();
}

async function TestRx() {
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        rx: 20,
    });
}

async function TestBorderRadius() {
    const rect = new sd.Rect({
        targetNode: svg,
    })
        .setWidth(200)
        .setHeight(150)
        .setCenterX(600)
        .setCenterY(300);
    await sd.pause();
    rect.startAnimate().setBorderRadius(20).endAnimate();
    await sd.pause();
    rect.startAnimate().setBorderRadius(50).endAnimate();
    await sd.pause();
    rect.startAnimate().setBorderRadius(75).endAnimate();
    await sd.pause();
    rect.startAnimate().setBorderRadius(0).endAnimate();
}

async function TestPosition() {
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
    });
    await sd.pause();
    rect.startAnimate().setX(200).endAnimate();
    await sd.pause();
    rect.startAnimate().setY(200).endAnimate();
    await sd.pause();
    rect.startAnimate().setX(100).endAnimate();
    await sd.pause();
    rect.startAnimate().setY(100).endAnimate();
}
