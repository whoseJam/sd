import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestPath);

async function TestPathTransform() {
  const str1 =
    "M 50 200 L 50 350 A 20 20 0 0 1 70 370 L 330 370 A 20 20 0 0 1 350 350 L 350 150 A 50 30 10 1 0 250 100 Q 180 80 150 120 T 90 140 C 70 160 60 130 70 120 L 70 200 A 15 15 0 0 0 50 200 Z";
  const str2 = "M 50 200 L 100 300 Z";
  const path = new sd.Path({
    targetNode: svg,
    d: str1,
  });
  await sd.pause();
  path.startAnimate().setD(str2).endAnimate();
}

async function TestPath() {
  const pen = new sd.PathPen();
  const path = new sd.Path({
    targetNode: svg,
    d: pen.MoveTo(100, 100).LineTo(150, 150).LineTo(100, 200).toString(),
  });
}
