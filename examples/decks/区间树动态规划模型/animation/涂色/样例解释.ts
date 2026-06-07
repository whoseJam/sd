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

const pattern = "BBRRBBGGYYBBBB".split("");
const N = pattern.length;

const CELL_W = 36;
const CELL_GAP = 2;
const CELL_H = 32;
const STEP = CELL_W + CELL_GAP;

const cxOf = (i: number) => (i - (N + 1) / 2) * STEP;

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

const DUR = 280;
sd.main(async () => {
  for (let i = 0; i < N; i++) {
    cells[i]
      .startAnimate({ delay: i * 35, duration: DUR, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
