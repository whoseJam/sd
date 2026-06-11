import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const APPLE_R = 8;
const APPLE_GAP = 2;
const APPLE_STEP = APPLE_R * 2 + APPLE_GAP;
const PLATE_W = 28;
const PLATE_GAP = 38;
const DUR = 280;
const FILL = C.darkOrange;
const NEUTRAL = C.darkButtonGrey;
const STRIP = C.steelBlue;

function fadeIn(el: sd.Path | sd.Circle | sd.Text, delay: number) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

function drawPlate(
  counts: number[],
  cxCenter: number,
  cyBase: number,
  t0: number,
  opt?: { hlEmpty?: boolean; hlBottomApple?: boolean },
) {
  for (let i = 0; i < counts.length; i++) {
    const cx = cxCenter + (i - (counts.length - 1) / 2) * PLATE_GAP;
    const isEmpty = counts[i] === 0;
    const plateColor = opt?.hlEmpty && isEmpty ? STRIP : NEUTRAL;
    const plate = new sd.Path({
      targetNode: svg,
      d: `M ${cx - PLATE_W / 2} ${cyBase} L ${cx + PLATE_W / 2} ${cyBase}`,
      stroke: plateColor,
      strokeWidth: 2,
      fill: "none",
      opacity: 0,
      strokeDashArray: opt?.hlEmpty && isEmpty ? [3, 3] : undefined,
    });
    fadeIn(plate, t0);

    for (let j = 0; j < counts[i]; j++) {
      const cy = cyBase + APPLE_R + 3 + j * APPLE_STEP;
      const isHL = opt?.hlBottomApple && j === 0;
      const circle = new sd.Circle({
        targetNode: svg,
        cx,
        cy,
        r: APPLE_R,
        fill: isHL ? STRIP : FILL,
        stroke: "none",
        opacity: 0,
      });
      fadeIn(circle, t0 + (j + 1) * 25);
    }
  }
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
  fadeIn(shaft, t0);
  fadeIn(head, t0 + 60);
}

const PANEL_A_CX = -250;
const PANEL_B_CX = 200;
const BASELINE = -40;

const labelA = new sd.Text({
  targetNode: svg,
  text: "至少一个空盘",
  cx: PANEL_A_CX,
  cy: 110,
  fontSize: 16,
  fill: STRIP,
  opacity: 0,
});
const labelB = new sd.Text({
  targetNode: svg,
  text: "每盘 ≥ 1",
  cx: PANEL_B_CX,
  cy: 110,
  fontSize: 16,
  fill: STRIP,
  opacity: 0,
});

const formula = new sd.Text({
  targetNode: svg,
  text: "f(n, m)  =  f(n, m - 1)  +  f(n - m, m)",
  cx: 0,
  cy: -130,
  fontSize: 18,
  fill: NEUTRAL,
  opacity: 0,
});

sd.main(async () => {
  fadeIn(labelA, 0);
  drawPlate([3, 2, 1, 0], PANEL_A_CX - 80, BASELINE, 60, { hlEmpty: true });
  arrow(PANEL_A_CX, PANEL_A_CX + 60, BASELINE + 30, 600);
  drawPlate([3, 2, 1], PANEL_A_CX + 130, BASELINE, 700);
  await sd.pause();

  fadeIn(labelB, 0);
  drawPlate([3, 2, 2, 1], PANEL_B_CX - 100, BASELINE, 60, {
    hlBottomApple: true,
  });
  arrow(PANEL_B_CX + 5, PANEL_B_CX + 65, BASELINE + 30, 600);
  drawPlate([2, 1, 1, 0], PANEL_B_CX + 145, BASELINE, 700);
  await sd.pause();

  fadeIn(formula, 0);
  await sd.pause();
});
