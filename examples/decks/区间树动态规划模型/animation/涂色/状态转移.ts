import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;

const PALETTE: Record<string, string> = {
  R: C.darkOrange,
  B: C.steelBlue,
  G: C.green,
  Y: C.yellow,
};

const pattern = "BBBRRBBBGGBBYYBB".split("");
const N = pattern.length;

const CELL_W = 32;
const CELL_GAP = 2;
const CELL_H = 28;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;
const midOf = (l: number, r: number) => (cxOf(l) + cxOf(r)) / 2;
const widthOf = (l: number, r: number) => (r - l + 1) * STEP - CELL_GAP;

const cells: sd.Rect[] = [];
for (let i = 0; i < N; i++) {
  const cx = cxOf(i + 1);
  cells.push(
    new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: PALETTE[pattern[i]],
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
  );
}

const BAR_H = 6;
const LAYER_GAP = 14;
const LAYER1_BOTTOM = CELL_H + 10;

interface NodeData {
  l: number;
  r: number;
  depth: number;
  parent: number;
  color: string;
}
const data: NodeData[] = [
  { l: 1, r: 16, depth: 0, parent: -1, color: "B" },
  { l: 4, r: 5, depth: 1, parent: 0, color: "R" },
  { l: 9, r: 10, depth: 1, parent: 0, color: "G" },
  { l: 13, r: 14, depth: 1, parent: 0, color: "Y" },
];
const MAX_DEPTH = 1;
const yBottomOf = (d: number) => LAYER1_BOTTOM + (MAX_DEPTH - d) * LAYER_GAP;

const tree: { rect: sd.Rect; line?: sd.Line; depth: number }[] = data.map(
  (d) => {
    const cx = midOf(d.l, d.r);
    const w = widthOf(d.l, d.r);
    const yB = yBottomOf(d.depth);
    const rect = new sd.Rect({
      targetNode: svg,
      x: cx - w / 2,
      y: yB,
      width: w,
      height: BAR_H,
      fill: PALETTE[d.color],
      stroke: "none",
      opacity: 0,
    });
    let line: sd.Line | undefined;
    if (d.parent >= 0) {
      const p = data[d.parent];
      line = new sd.Line({
        targetNode: svg,
        x1: midOf(p.l, p.r),
        y1: yBottomOf(p.depth),
        x2: cx,
        y2: yB + BAR_H,
        stroke: NEUTRAL,
        strokeWidth: 1,
        opacity: 0,
      });
    }
    return { rect, line, depth: d.depth };
  },
);

const DUR = 280;
type AnyEl = sd.Rect | sd.Line;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i], i * 25);
  await sd.pause();
  for (let d = 0; d <= MAX_DEPTH; d++) {
    const layer = tree.filter((n) => n.depth === d);
    layer.forEach((n, idx) => {
      fadeIn(n.rect, idx * 60);
      if (n.line) fadeIn(n.line, idx * 60 + 80);
    });
    await sd.pause();
  }
});
