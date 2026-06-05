import * as sd from "@/sd";

// Two circles labelled with their centres + distance — d ≤ 2r means
// the two holes touch / overlap and the mouse can pass between them.

const svg = sd.svg();
const C = sd.color();

const R = 40;
const GAP = 30;
const c1 = { cx: -R - GAP / 2, cy: 0 };
const c2 = { cx: R + GAP / 2, cy: 0 };

new sd.Circle({ targetNode: svg, cx: c1.cx, cy: c1.cy, r: R, fill: "#fff8e0", stroke: C.darkOrange, strokeWidth: 1.4 });
new sd.Circle({ targetNode: svg, cx: c2.cx, cy: c2.cy, r: R, fill: "#fff8e0", stroke: C.darkOrange, strokeWidth: 1.4 });

new sd.Circle({ targetNode: svg, cx: c1.cx, cy: c1.cy, r: 3, fill: C.darkButtonGrey });
new sd.Circle({ targetNode: svg, cx: c2.cx, cy: c2.cy, r: 3, fill: C.darkButtonGrey });

new sd.Line({
  targetNode: svg,
  x1: c1.cx,
  y1: c1.cy,
  x2: c2.cx,
  y2: c2.cy,
  stroke: C.darkButtonGrey,
  strokeWidth: 1.4,
  strokeDashArray: [4, 3],
});

new sd.Math({ targetNode: svg, text: "d", cx: 0, cy: 16, fontSize: 16, fill: C.darkButtonGrey });
new sd.Math({ targetNode: svg, text: "d \\le 2r \\Rightarrow \\text{相交 / 相切}", cx: 0, cy: -R - 28, fontSize: 16, fill: C.darkOrange });

sd.main(async () => {
  await sd.pause();
});
