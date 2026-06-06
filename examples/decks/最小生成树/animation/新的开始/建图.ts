import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// 4 mines + super source.
const source = { id: 0, cx: 0, cy: 80 };
const mines = [
  { id: 1, cx: -120, cy: -40 },
  { id: 2, cx: -40, cy: -40 },
  { id: 3, cx: 40, cy: -40 },
  { id: 4, cx: 120, cy: -40 },
];

const sourceCircle = new sd.Circle({
  targetNode: svg,
  cx: source.cx,
  cy: source.cy,
  r: 22,
  fill: "#fdecd9",
  stroke: C.darkOrange,
  strokeWidth: 2.2,
  opacity: 0,
});
const sourceLabel = new sd.Text({
  targetNode: svg,
  text: "s",
  cx: source.cx,
  cy: source.cy,
  fontSize: 14,
  fill: C.darkOrange,
  opacity: 0,
});

for (const m of mines) {
  new sd.Circle({
    targetNode: svg,
    cx: m.cx,
    cy: m.cy,
    r: 18,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
  });
  new sd.Text({
    targetNode: svg,
    text: String(m.id),
    cx: m.cx,
    cy: m.cy,
    fontSize: 13,
    fill: C.darkButtonGrey,
  });
}

// Mine-mine edges (just a few for show).
const mEdges: Array<[number, number, number]> = [
  [1, 2, 5],
  [2, 3, 4],
  [3, 4, 6],
  [1, 3, 8],
];
for (const [u, v, w] of mEdges) {
  const a = mines.find((m) => m.id === u)!;
  const b = mines.find((m) => m.id === v)!;
  new sd.Line({
    targetNode: svg,
    x1: a.cx,
    y1: a.cy,
    x2: b.cx,
    y2: b.cy,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
  });
  new sd.Text({
    targetNode: svg,
    text: String(w),
    cx: (a.cx + b.cx) / 2,
    cy: (a.cy + b.cy) / 2 - 6,
    fontSize: 11,
    fill: C.darkButtonGrey,
  });
}

const sourceEdges: Array<{
  to: number;
  w: number;
  line: sd.Line;
  label: sd.Text;
}> = [];
for (let i = 0; i < mines.length; i++) {
  const m = mines[i];
  const line = new sd.Line({
    targetNode: svg,
    x1: source.cx,
    y1: source.cy,
    x2: m.cx,
    y2: m.cy,
    stroke: C.darkOrange,
    strokeWidth: 1.6,
    opacity: 0,
  });
  const label = new sd.Text({
    targetNode: svg,
    text: `v_${m.id}`,
    cx: (source.cx + m.cx) / 2 + 6,
    cy: (source.cy + m.cy) / 2,
    fontSize: 11,
    fill: C.darkOrange,
    opacity: 0,
  });
  sourceEdges.push({ to: m.id, w: 3, line, label });
}

sd.main(async () => {
  sourceCircle
    .startAnimate({ delay: 200, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  sourceLabel
    .startAnimate({ delay: 280, duration: 240, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
  for (let i = 0; i < sourceEdges.length; i++) {
    const { line, label } = sourceEdges[i];
    line
      .startAnimate({ delay: i * 200, duration: 320, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
    label
      .startAnimate({ delay: i * 200 + 80, duration: 240, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
