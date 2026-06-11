import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const BOX_W = 70;
const BOX_H = 32;

function box(cx: number, cy: number) {
  return new sd.Rect({
    targetNode: svg,
    cx,
    cy,
    width: BOX_W,
    height: BOX_H,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.3,
    opacity: 0,
  });
}

function label(text: string, cx: number, cy: number, color = C.darkButtonGrey) {
  return new sd.Text({
    targetNode: svg,
    text,
    cx,
    cy,
    fontSize: 14,
    fill: color,
    opacity: 0,
  });
}

function arrow(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const sx = ax + ux * (BOX_H / 2);
  const sy = ay + uy * (BOX_H / 2);
  const tx = bx - ux * (BOX_H / 2);
  const ty = by - uy * (BOX_H / 2);
  const line = new sd.Path({
    targetNode: svg,
    d: `M ${sx} ${sy} L ${tx} ${ty}`,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.1,
    fill: "none",
    opacity: 0,
  });
  const hs = 5;
  const px = -uy;
  const py = ux;
  const h1x = tx - ux * hs + px * (hs / 2);
  const h1y = ty - uy * hs + py * (hs / 2);
  const h2x = tx - ux * hs - px * (hs / 2);
  const h2y = ty - uy * hs - py * (hs / 2);
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${tx} ${ty} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return [line, head];
}

const ROOT = { cx: 0, cy: 60 };
const CHILDREN = [
  { cx: -110, cy: -40 },
  { cx: 0, cy: -40 },
  { cx: 110, cy: -40 },
];

const rootBox = box(ROOT.cx, ROOT.cy);
const rootLabel = label("", ROOT.cx, ROOT.cy);
const childBoxes = CHILDREN.map((p) => box(p.cx, p.cy));
const childLabels = CHILDREN.map((p) =>
  label("win", p.cx, p.cy, C.steelBlue as sd.SDColor),
);
const arrows = CHILDREN.map((p) => arrow(ROOT.cx, ROOT.cy, p.cx, p.cy)).flat();

sd.main(async () => {
  rootBox
    .startAnimate({ duration: 280, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  let d = 0;
  for (let i = 0; i < 3; i++) {
    childBoxes[i]
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    childLabels[i]
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    d += 60;
  }
  for (const a of arrows) {
    a.startAnimate({ delay: d, duration: 220, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  childLabels[2]
    .startAnimate({ delay: d + 180, duration: 220 })
    .setText("lose")
    .setFill("#c62828" as sd.SDColor)
    .endAnimate();
  await sd.pause();
  rootLabel
    .startAnimate({ duration: 240 })
    .setText("win")
    .setFill(C.steelBlue as sd.SDColor)
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
