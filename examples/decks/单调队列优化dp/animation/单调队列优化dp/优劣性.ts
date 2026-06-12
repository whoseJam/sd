import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

interface Cand {
  jLabel: string;
  G: number;
  cx: number;
  loserColor: boolean;
}

const SCALE = 14;
const BAR_W = 64;

const cands: Cand[] = [
  { jLabel: "j_1", G: 3, cx: -100, loserColor: true },
  { jLabel: "j_2", G: 7, cx: 100, loserColor: false },
];

interface Handle {
  bar: sd.Rect;
  gLabel: sd.Math;
  jLabel: sd.Math;
}

const handles: Handle[] = cands.map((c) => {
  const barH = c.G * SCALE;
  const bar = new sd.Rect({
    targetNode: svg,
    cx: c.cx,
    cy: barH / 2 - 30,
    width: BAR_W,
    height: barH,
    fill: c.loserColor ? "#f3d4d4" : "#d6e7f2",
    stroke: c.loserColor ? C.crimson : C.steelBlue,
    strokeWidth: 1.4,
    opacity: 0,
  });
  const gLabel = new sd.Math({
    targetNode: svg,
    text: `G(${c.jLabel}) = ${c.G}`,
    cx: c.cx,
    cy: barH - 30 + 16,
    fontSize: 14,
    fill: c.loserColor ? C.crimson : C.steelBlue,
    opacity: 0,
  });
  const jLabel = new sd.Math({
    targetNode: svg,
    text: c.jLabel,
    cx: c.cx,
    cy: -46,
    fontSize: 16,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return { bar, gLabel, jLabel };
});

const condition = new sd.Math({
  targetNode: svg,
  text: "j_1 < j_2 \\;\\land\\; G(j_1) \\le G(j_2)",
  cx: 0,
  cy: -90,
  fontSize: 15,
  fill: C.darkButtonGrey,
  opacity: 0,
});

const verdict = new sd.Math({
  targetNode: svg,
  text: "j_1 \\text{ 永远不可能成为窗口最优解，可以扔掉}",
  cx: 0,
  cy: -120,
  fontSize: 14,
  fill: C.crimson,
  opacity: 0,
});

function fade(el: sd.SDNode, delay: number, dur = 280) {
  el.startAnimate({ delay, duration: dur, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  handles.forEach((h, i) => {
    const base = i * 200;
    fade(h.jLabel, base);
    fade(h.bar, base + 80);
    fade(h.gLabel, base + 200);
  });
  await sd.pause();

  fade(condition, 0);
  await sd.pause();

  fade(verdict, 0);
  handles[0].bar
    .startAnimate({ delay: 80, duration: 260, easing: E.easeOut })
    .setOpacity(0.35)
    .endAnimate();
  handles[0].gLabel
    .startAnimate({ delay: 80, duration: 260, easing: E.easeOut })
    .setOpacity(0.4)
    .endAnimate();
  await sd.pause();
});
