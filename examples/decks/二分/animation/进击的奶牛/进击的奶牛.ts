import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

// Number line with 11 rooms, place cows greedily with distance >= D.
const rooms = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const N = rooms.length;
const SCALE = 22;
const X0 = -((rooms[N - 1] - rooms[0]) * SCALE) / 2;

const xOf = (r: number) => X0 + (r - rooms[0]) * SCALE;

new sd.Line({
  targetNode: svg,
  x1: xOf(rooms[0]) - 10, y1: 0,
  x2: xOf(rooms[N - 1]) + 10, y2: 0,
  stroke: C.darkButtonGrey, strokeWidth: 1.2,
});

for (const r of rooms) {
  new sd.Line({
    targetNode: svg, x1: xOf(r), y1: -4, x2: xOf(r), y2: 4,
    stroke: C.darkButtonGrey, strokeWidth: 1,
  });
  new sd.Text({
    targetNode: svg, text: String(r),
    cx: xOf(r), cy: 14,
    fontSize: 11, fill: C.darkButtonGrey,
  });
}

const D = 6;
const cows: number[] = [];
let cur = rooms[0];
cows.push(cur);
for (const r of rooms) {
  if (r - cur >= D) { cows.push(r); cur = r; }
}

const E = sd.easing();
sd.main(async () => {
  await sd.pause();
  for (let i = 0; i < cows.length; i++) {
    const cx = xOf(cows[i]);
    const c = new sd.Circle({
      targetNode: svg, cx, cy: -14, r: 8,
      fill: "#fdecd9", stroke: C.darkOrange, strokeWidth: 1.6, opacity: 0,
    });
    c.startAnimate({ delay: i * 280, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  new sd.Math({
    targetNode: svg,
    text: `distance \\ge ${D}`,
    cx: 0, cy: -50,
    fontSize: 14, fill: C.darkOrange,
    opacity: 0,
  }).startAnimate({ delay: 400, duration: 280, easing: E.easeOut }).setOpacity(1).endAnimate();
  await sd.pause();
});
