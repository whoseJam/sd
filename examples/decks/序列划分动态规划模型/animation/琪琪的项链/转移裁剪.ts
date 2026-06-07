import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const I_HL = C.darkOrange;

const PALETTE: Record<string, string> = {
  R: C.red,
  B: C.steelBlue,
  G: C.green,
};

const pattern = "RRBGGRGGRRRR".split("");
const N = pattern.length;
const I = 7;

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 30;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

const cells: sd.Rect[] = pattern.map((ch, i) => {
  const cx = cxOf(i);
  return new sd.Rect({
    targetNode: svg,
    x: cx - CELL_W / 2,
    y: 0,
    width: CELL_W,
    height: CELL_H,
    fill: PALETTE[ch],
    stroke: NEUTRAL,
    strokeWidth: 1,
    opacity: 0,
  });
});

const iLabel = new sd.Math({
  targetNode: svg,
  text: "i",
  cx: cxOf(I),
  cy: -14,
  fontSize: 14,
  fill: I_HL,
  opacity: 0,
});

const seenColors = new Set<string>();
const validJ: number[] = [];
for (let j = I - 1; j >= 0; j--) {
  if (seenColors.has(pattern[j])) continue;
  seenColors.add(pattern[j]);
  validJ.push(j);
}

function makeArc(jPos: number, iPos: number, color: string): sd.Path {
  const x1 = cxOf(jPos);
  const x2 = cxOf(iPos);
  const y = CELL_H;
  const arcH = 16 + (iPos - jPos) * 4;
  return new sd.Path({
    targetNode: svg,
    d: `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + arcH} ${x2} ${y}`,
    stroke: color,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });
}

const arcs = validJ.map((j) => makeArc(j, I, PALETTE[pattern[j]]));

const iTick = new sd.Line({
  targetNode: svg,
  x1: cxOf(I),
  y1: 0,
  x2: cxOf(I),
  y2: -6,
  stroke: I_HL,
  strokeWidth: 2,
  opacity: 0,
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text | sd.Math | sd.Line | sd.Path;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i], i * 30);
  await sd.pause();

  fadeIn(iLabel, 0);
  fadeIn(iTick, 0);
  await sd.pause();

  for (let k = 0; k < arcs.length; k++) fadeIn(arcs[k], k * 150);
  await sd.pause();
});
