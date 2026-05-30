import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestFadeInAndFadeOut);

async function TestFadeInAndFadeOut() {
    const node1 = new sd.Rect(svg).x(100).y(100);
    const node2 = new sd.Circle(svg).x(200).y(100);
    await sd.pause();
    node1.startAnimate().fadeOut().endAnimate();
    node2.startAnimate().fadeOut().endAnimate();
    await sd.pause();
    node1.startAnimate().fadeIn().endAnimate();
    node2.startAnimate().fadeIn().endAnimate();
}

async function TestZoomInAndZoomOut() {
    const node1 = new sd.Rect(svg).x(100).y(100);
    const node2 = new sd.Circle(svg).x(200).y(100);
    await sd.pause();
    node1.startAnimate().zoomIn().endAnimate();
    node2.startAnimate().zoomIn().endAnimate();
    await sd.pause();
    node1.startAnimate().zoomOut().endAnimate();
    node2.startAnimate().zoomOut().endAnimate();
}

async function TestAppearAndDisappear() {
    const node1 = new sd.Rect(svg).x(100).y(100);
    const node2 = new sd.Circle(svg).x(200).y(100);
    await sd.pause();
    node1.startAnimate().disappear().endAnimate();
    node2.startAnimate().disappear().endAnimate();
    await sd.pause();
    node1.startAnimate().appear().endAnimate();
    node2.startAnimate().appear().endAnimate();
}
