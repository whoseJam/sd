import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const I = sd.input();

const rect = new sd.Rect({
    targetNode: svg,
    width: 20,
    height: 20,
    fill: C.rosyBrown,
});

let time = 0;

sd.loopUpdate((dt: number) => {
    time += dt;
    rect.setCenterX(100).setCenterY(Math.sin(time / 100000) * 30 + 300);
});
