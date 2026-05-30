import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestPointAndFade);

async function TestValue() {
    const line = new sd.Line({
        targetNode: svg,
        x1: 100,
        y1: 100,
        x2: 300,
        y2: 200,
    });
    const rect = new sd.Rect({
        targetNode: svg,
        width: 20,
        height: 20,
        fill: C.rosyBrown,
    });
    rect.setCenter(line.getPointAtRate(0.5));
}

async function TestLine() {
    const line = new sd.Line({
        targetNode: svg,
        x1: 100,
        y1: 100,
        x2: 300,
        y2: 200,
    });
    await sd.pause();
    line.startAnimate().setStrokeWidth(5).endAnimate();
}

async function TestPointAndFade() {
    const obj = new sd.Line({
        targetNode: svg,
        x1: 100,
        y1: 100,
        x2: 500,
        y2: 200,
    });
    while (true) {
        await sd.pause();
        console.log("P S -> T");
        obj.startAnimate().pointStoT().endAnimate();
        await sd.pause();
        console.log("F S -> T");
        obj.startAnimate().fadeStoT().endAnimate();
        await sd.pause();
        console.log("P T -> S");
        obj.startAnimate().pointTtoS().endAnimate();
        await sd.pause();
        console.log("F T -> S");
        obj.startAnimate().fadeTtoS().endAnimate();
    }
}
