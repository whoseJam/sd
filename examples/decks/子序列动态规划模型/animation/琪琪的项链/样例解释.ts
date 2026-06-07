import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;

const PALETTE: Record<string, string> = {
  R: C.red,
  B: C.steelBlue,
  G: C.green,
};

const pattern = "RRBGGRGGRRRR".split("");
const checked = [0, 2, 3, 5];
const N = pattern.length;

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 30;
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
      fontSize: 16,
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

sd.main(async () => {
  for (let i = 0; i < N; i++) fadeIn(cells[i].bg, i * 35);
  await sd.pause();
  for (const idx of checked) fadeIn(cells[idx].check, 0);
  await sd.pause();
});
