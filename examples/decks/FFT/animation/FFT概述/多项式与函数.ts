import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const UNIT_X = 30;
const UNIT_Y = 20;
const X_LO = -4.2;
const X_HI = 4.2;
const Y_LIMIT = 3.2;

const HEAD_LEN = 8;
const HEAD_WIDTH = 6;
const AXIS = C.darkButtonGrey;

const LABEL_X = X_HI * UNIT_X + 120;

function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: sd.SDColor,
  strokeWidth: number,
) {
  new sd.Line({
    targetNode: svg,
    x1,
    y1,
    x2,
    y2,
    stroke: color,
    strokeWidth,
  });
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const ax = x2 - ux * HEAD_LEN + px * (HEAD_WIDTH / 2);
  const ay = y2 - uy * HEAD_LEN + py * (HEAD_WIDTH / 2);
  const bx = x2 - ux * HEAD_LEN - px * (HEAD_WIDTH / 2);
  const by = y2 - uy * HEAD_LEN - py * (HEAD_WIDTH / 2);
  new sd.Path({
    targetNode: svg,
    d: `M ${x2} ${y2} L ${ax} ${ay} L ${bx} ${by} Z`,
    fill: color,
    stroke: color,
    strokeWidth: 1,
  });
}

arrow(X_LO * UNIT_X - 6, 0, X_HI * UNIT_X + 6, 0, AXIS, 1.2);
arrow(0, -Y_LIMIT * UNIT_Y - 6, 0, Y_LIMIT * UNIT_Y + 6, AXIS, 1.2);

function plot(fn: (x: number) => number, color: sd.SDColor): sd.Path {
  const STEPS = 240;
  let d = "";
  let pen = false;
  for (let i = 0; i <= STEPS; i++) {
    const x = X_LO + ((X_HI - X_LO) * i) / STEPS;
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > Y_LIMIT) {
      pen = false;
      continue;
    }
    const px = x * UNIT_X;
    const py = y * UNIT_Y;
    d += (pen ? "L " : "M ") + px + " " + py + " ";
    pen = true;
  }
  return new sd.Path({
    targetNode: svg,
    d,
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    opacity: 0,
  });
}

const plotA = plot((x) => x * x + 3 * x + 2, C.blue);
const plotB = plot((x) => -0.5 * x * x + 1, C.darkOrange);
const plotC = plot((x) => -x - 3, C.green);

const labelA = new sd.Math({
  targetNode: svg,
  text: "A(x)=x^2+3x+2",
  cx: LABEL_X,
  cy: 40,
  fontSize: 18,
  fill: C.blue,
  opacity: 0,
});
const labelB = new sd.Math({
  targetNode: svg,
  text: "B(x)=-\\frac{1}{2}x^2+1",
  cx: LABEL_X,
  cy: 0,
  fontSize: 18,
  fill: C.darkOrange,
  opacity: 0,
});
const labelC = new sd.Math({
  targetNode: svg,
  text: "C(x)=-x-3",
  cx: LABEL_X,
  cy: -40,
  fontSize: 18,
  fill: C.green,
  opacity: 0,
});

function reveal(curve: sd.Path, label: sd.Math) {
  curve
    .startAnimate({ duration: 380, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  label
    .startAnimate({ duration: 380, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  await sd.pause();
  reveal(plotA, labelA);
  await sd.pause();
  reveal(plotB, labelB);
  await sd.pause();
  reveal(plotC, labelC);
  await sd.pause();
});
