import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const NEUTRAL = C.darkButtonGrey;
const GROUP_COLORS = [C.darkOrange, C.steelBlue, C.green];

const N = 6;
const PARTITION = [0, 1, 0, 2, 1, 2];

const CELL_W = 50;
const CELL_H = 44;
const GAP = 8;
const STEP = CELL_W + GAP;
const cxOf = (i: number) => (i - (N - 1) / 2) * STEP;

interface Cell {
  bg: sd.Rect;
  text: sd.Text;
}
const cells: Cell[] = [];
for (let i = 0; i < N; i++) {
  const cx = cxOf(i);
  cells.push({
    bg: new sd.Rect({
      targetNode: svg,
      x: cx - CELL_W / 2,
      y: -CELL_H / 2,
      width: CELL_W,
      height: CELL_H,
      fill: "none",
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      opacity: 0,
    }),
    text: new sd.Text({
      targetNode: svg,
      text: String(i + 1),
      cx,
      cy: 0,
      fontSize: 18,
      fill: NEUTRAL,
      opacity: 0,
    }),
  });
}

const groupArcs: sd.Path[] = [];
for (let g = 0; g < GROUP_COLORS.length; g++) {
  const members: number[] = [];
  for (let i = 0; i < N; i++) if (PARTITION[i] === g) members.push(i);
  if (members.length < 2) continue;
  for (let a = 0; a < members.length; a++) {
    for (let b = a + 1; b < members.length; b++) {
      const x1 = cxOf(members[a]);
      const x2 = cxOf(members[b]);
      const distance = Math.abs(x2 - x1);
      const lift = -CELL_H / 2 - 18 - distance * 0.18;
      groupArcs.push(
        new sd.Path({
          targetNode: svg,
          d: `M ${x1} ${-CELL_H / 2} Q ${(x1 + x2) / 2} ${lift} ${x2} ${-CELL_H / 2}`,
          stroke: GROUP_COLORS[g],
          strokeWidth: 1.6,
          fill: "none",
          opacity: 0,
        }),
      );
    }
  }
}

const DUR = 280;
function fadeIn(el: sd.Rect | sd.Text | sd.Path, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
}
function setFill(el: sd.Rect | sd.Text, color: string, delay = 0) {
  el.startAnimate({ delay, duration: DUR, easing: E.easeOut })
    .setFill(color)
    .endAnimate();
}

sd.main(async () => {
  for (let i = 0; i < N; i++) {
    fadeIn(cells[i].bg, i * 40);
    fadeIn(cells[i].text, i * 40 + 60);
  }
  await sd.pause();

  for (let i = 0; i < N; i++) {
    const color = GROUP_COLORS[PARTITION[i]];
    setFill(cells[i].bg, color, i * 60);
    setFill(cells[i].text, "#ffffff", i * 60 + 40);
  }
  for (let k = 0; k < groupArcs.length; k++)
    fadeIn(groupArcs[k], 200 + k * 100);
  await sd.pause();
});
