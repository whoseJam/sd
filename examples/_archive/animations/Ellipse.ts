import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestRotation);

async function TestRotation() {
  const e = new sd.Ellipse({
    targetNode: svg,
    rx: 100,
    ry: 50,
    cx: 500,
    cy: 200,
  }).setTransformOrigin("center", "center");
  const slider = new sd.Slider({
    targetNode: svg,
    min: 0,
    max: 360,
    value: 0,
  }).onValueChanged((value) => {
    e.setRotation(value);
  });
}

async function TestEllipse() {
  const e = new sd.Ellipse({
    targetNode: svg,
    rx: 100,
    ry: 50,
    cx: 600,
    cy: 300,
  });
  await sd.pause();
  e.startAnimate().setRx(60).endAnimate();
}
