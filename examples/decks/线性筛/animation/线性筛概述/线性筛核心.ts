import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const N = 20;
const COLS = 5;
const ROWS = Math.ceil(N / COLS);
const CELL_W = 34;
const CELL_H = 28;
const GAP = 3;

const PRIME_FILL = "#e3f2fd";
const PRIME_STROKE = C.steelBlue;
const COMP_FILL = "#fdecd9";
const COMP_STROKE = C.darkOrange;

function cellTopLeft(n: number): { x: number; y: number } {
  const idx = n - 1;
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = -((COLS - 1) * (CELL_W + GAP)) / 2 - CELL_W / 2 + col * (CELL_W + GAP);
  const y = -((ROWS - 1) * (CELL_H + GAP)) / 2 - CELL_H / 2 + row * (CELL_H + GAP);
  return { x, y };
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

const cellBgs = new Map<number, sd.Rect>();
const cellTexts = new Map<number, sd.Text>();
const spfLabels = new Map<number, sd.Text>();

for (let n = 1; n <= N; n++) {
  const { x, y } = cellTopLeft(n);
  cellBgs.set(
    n,
    new sd.Rect({
      targetNode: svg,
      x, y,
      width: CELL_W, height: CELL_H,
      fill: C.white,
      stroke: C.silver,
      strokeWidth: 0.8,
      rx: 3, ry: 3,
      opacity: 0,
    }),
  );
  cellTexts.set(
    n,
    new sd.Text({
      targetNode: svg,
      text: String(n),
      cx: x + CELL_W / 2,
      cy: y + CELL_H / 2 - 1,
      fontSize: 13,
      fill: C.darkButtonGrey,
      opacity: 0,
    }),
  );
}

// Build sieve mark order: for each composite, the order in which the
// linear sieve marks it (each composite struck exactly once).
const markOrder: Array<{ c: number; p: number }> = [];
{
  const vis = new Array<boolean>(N + 1).fill(false);
  const prim: number[] = [];
  for (let i = 2; i <= N; i++) {
    if (!vis[i]) prim.push(i);
    for (let j = 0; j < prim.length && i * prim[j] <= N; j++) {
      const c = i * prim[j];
      vis[c] = true;
      markOrder.push({ c, p: prim[j] });
      if (i % prim[j] === 0) break;
    }
  }
}

for (const { c, p } of markOrder) {
  const { x, y } = cellTopLeft(c);
  spfLabels.set(
    c,
    new sd.Text({
      targetNode: svg,
      text: `×${p}`,
      cx: x + CELL_W - 9,
      cy: y + CELL_H - 6,
      fontSize: 8,
      fill: C.darkOrange,
      opacity: 0,
    }),
  );
}

sd.main(async () => {
  // p1: grid appears
  for (let n = 1; n <= N; n++) {
    const d = (n - 1) * 35;
    cellBgs.get(n)!
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
    cellTexts.get(n)!
      .startAnimate({ delay: d + 60, duration: 260, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();

  // p2: primes highlight
  let k = 0;
  for (let n = 2; n <= N; n++) {
    if (!isPrime(n)) continue;
    const d = k++ * 80;
    cellBgs.get(n)!
      .startAnimate({ delay: d, duration: 300, easing: E.easeOut })
      .setFill(PRIME_FILL).setStroke(PRIME_STROKE).setStrokeWidth(1.4)
      .endAnimate();
    cellTexts.get(n)!
      .startAnimate({ delay: d, duration: 300, easing: E.easeOut })
      .setFill(PRIME_STROKE).endAnimate();
  }
  await sd.pause();

  // p3: composites struck in sieve order, each with ×p label
  for (let i = 0; i < markOrder.length; i++) {
    const { c } = markOrder[i];
    const d = i * 140;
    cellBgs.get(c)!
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setFill(COMP_FILL).setStroke(COMP_STROKE).setStrokeWidth(1)
      .endAnimate();
    cellTexts.get(c)!
      .startAnimate({ delay: d, duration: 260, easing: E.easeOut })
      .setFill(COMP_STROKE).endAnimate();
    spfLabels.get(c)!
      .startAnimate({ delay: d + 80, duration: 240, easing: E.easeOut })
      .setOpacity(1).endAnimate();
  }
  await sd.pause();
});
