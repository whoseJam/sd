import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;

const PALETTE: Record<string, string> = {
  R: C.red,
  G: C.green,
};

const pattern = "RRGGRGRG".split("");
const N = pattern.length;
const states: number[][] = [
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
];
const canonical = [1, 3];

const CELL_W = 40;
const CELL_GAP = 2;
const CELL_H = 32;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  check: sd.Text;
}
const cells: Cell[] = pattern.map((ch, i) => {
  const cx = cxOf(i);
  return {
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: 0,
      width: CELL_W,
      height: CELL_H,
      fill: PALETTE[ch],
      stroke: NEUTRAL,
      strokeWidth: 1,
      opacity: 0,
    }),
    check: new sd.Text({
      targetNode: svg,
      text: "✔",
      cx,
      cy: CELL_H / 2,
      fontSize: 18,
      fill: "#ffffff",
      opacity: 0,
    }),
  };
});

const DUR = 280;
type AnyEl = sd.Rect | sd.Text;
function fadeIn(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function fadeOut(el: AnyEl, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(0)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i].bg, i * 35);
  await sd.pause();

  let current = new Set<number>();
  for (const next of [...states, canonical]) {
    const nextSet = new Set(next);
    for (let i = 0; i < N; i++) {
      const wasOn = current.has(i);
      const willOn = nextSet.has(i);
      if (wasOn && !willOn) fadeOut(cells[i].check);
      else if (!wasOn && willOn) fadeIn(cells[i].check, 80);
    }
    current = nextSet;
    await sd.pause();
  }
});
