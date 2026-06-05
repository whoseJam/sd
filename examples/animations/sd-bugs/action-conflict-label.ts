import * as sd from "@/sd";

// Bug 4 repro: two overlapping fill animations on the same Rect should
// throw with the entity label (Rect.fill), not just "fill".

const svg = sd.svg();
const C = sd.color();

const r = new sd.Rect({
  targetNode: svg,
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  fill: C.white,
});

sd.main(async () => {
  await sd.pause();
  r.startAnimate({ duration: 260 }).setFill(C.red).endAnimate();
  r.startAnimate({ delay: 40, duration: 260 }).setFill(C.blue).endAnimate();
  await sd.pause();
});
