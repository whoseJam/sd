import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const CELL = 16;
const GAP = 3;
const STEP = CELL + GAP;
const DUR = 280;
const FILL = C.darkOrange;
const NEUTRAL = C.darkButtonGrey;
const STRIP = C.steelBlue;

interface FerrersOpts {
  cx: number;
  cy: number;
  fillFn?: (r: number, c: number) => string;
}

function placeFerrers(p: number[], opt: FerrersOpts, t0: number): sd.Rect[] {
  const rows = p.length;
  const widest = Math.max(...p);
  const baseX = opt.cx - ((widest - 1) * STEP) / 2;
  const rects: sd.Rect[] = [];
  for (let r = 0; r < rows; r++) {
    const cy = opt.cy + ((rows - 1) / 2 - r) * STEP;
    for (let c = 0; c < p[r]; c++) {
      const cx = baseX + c * STEP;
      const f = opt.fillFn ? opt.fillFn(r, c) : FILL;
      const rect = new sd.Rect({
        targetNode: svg,
        x: cx - CELL / 2,
        y: cy - CELL / 2,
        width: CELL,
        height: CELL,
        fill: f,
        stroke: "none",
        opacity: 0,
      });
      rect
        .startAnimate({
          delay: t0 + (r * 5 + c) * 20,
          duration: DUR,
          easing: E.easeOut,
        })
        .setOpacity(1)
        .endAnimate();
      rects.push(rect);
    }
  }
  return rects;
}

function arrow(x0: number, x1: number, y: number, t0: number) {
  const shaft = new sd.Path({
    targetNode: svg,
    d: `M ${x0} ${y} L ${x1 - 6} ${y}`,
    stroke: NEUTRAL,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y} L ${x1 - 8} ${y + 4} L ${x1 - 8} ${y - 4} Z`,
    stroke: NEUTRAL,
    strokeWidth: 1.4,
    fill: NEUTRAL,
    opacity: 0,
  });
  shaft
    .startAnimate({ delay: t0, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  head
    .startAnimate({ delay: t0 + 60, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

const labelA = new sd.Text({
  targetNode: svg,
  text: "最小段 = 1",
  cx: -210,
  cy: 110,
  fontSize: 16,
  fill: STRIP,
  opacity: 0,
});
const labelB = new sd.Text({
  targetNode: svg,
  text: "每段 ≥ 2",
  cx: 190,
  cy: 110,
  fontSize: 16,
  fill: STRIP,
  opacity: 0,
});

const cyPanel = 30;

const formula = new sd.Text({
  targetNode: svg,
  text: "f(n, k)  =  f(n - 1, k - 1)  +  f(n - k, k)",
  cx: 0,
  cy: -120,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  labelA
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  placeFerrers(
    [4, 3, 2, 1],
    { cx: -310, cy: cyPanel, fillFn: (r) => (r === 3 ? STRIP : FILL) },
    80,
  );
  arrow(-230, -170, cyPanel, 600);
  placeFerrers([4, 3, 2], { cx: -90, cy: cyPanel }, 700);
  await sd.pause();

  labelB
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  placeFerrers(
    [3, 3, 2, 2],
    { cx: 90, cy: cyPanel, fillFn: (_r, c) => (c === 0 ? STRIP : FILL) },
    80,
  );
  arrow(155, 215, cyPanel, 600);
  placeFerrers([2, 2, 1, 1], { cx: 290, cy: cyPanel }, 700);
  await sd.pause();

  formula
    .startAnimate({ duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
