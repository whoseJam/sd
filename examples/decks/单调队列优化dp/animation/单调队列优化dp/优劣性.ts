import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Show two candidates j1 < j2 with G(j1) <= G(j2): j1 dominated.
const candidates: Array<{ j: number; G: number; label: string }> = [
  { j: 2, G: 3, label: "j_1" },
  { j: 5, G: 7, label: "j_2" },
];

const X0 = -180;
const SIZE = 50;
const BAR_W = 70;
const SCALE = 14;

for (let i = 0; i < candidates.length; i++) {
  const c = candidates[i];
  const x = X0 + i * 220;
  new sd.Rect({
    targetNode: svg,
    x,
    y: (-c.G * SCALE) / 2,
    width: BAR_W,
    height: c.G * SCALE,
    fill: i === 0 ? "#fde9e9" : "#e8f5e9",
    stroke: i === 0 ? ("#d32f2f" as sd.SDColor) : C.darkGreen,
    strokeWidth: 1.6,
  });
  new sd.Math({
    targetNode: svg,
    text: `G(${c.label}) = ${c.G}`,
    cx: x + BAR_W / 2,
    cy: (-c.G * SCALE) / 2 - 20,
    fontSize: 14,
    fill: i === 0 ? ("#d32f2f" as sd.SDColor) : C.darkGreen,
  });
  new sd.Math({
    targetNode: svg,
    text: c.label,
    cx: x + BAR_W / 2,
    cy: (c.G * SCALE) / 2 + 16,
    fontSize: 16,
    fill: C.darkButtonGrey,
  });
  void SIZE;
}

sd.main(async () => {
  await sd.pause();
  new sd.Math({
    targetNode: svg,
    text: "j_1 < j_2 \\land G(j_1) \\le G(j_2) \\Rightarrow j_1 \\text{ 可弃}",
    cx: 0,
    cy: -100,
    fontSize: 14,
    fill: C.darkButtonGrey,
    opacity: 0,
  })
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});
