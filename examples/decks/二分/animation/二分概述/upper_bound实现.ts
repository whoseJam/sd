import * as sd from "@/sd";

import { Axis, bracePath, pointer } from "../lib/axis";

const svg = sd.svg();
const C = sd.color();

const TICKS = 20;
const GAP = 24;
const X0 = -(TICKS * GAP) / 2;
const AT = 12;

const axis = new Axis({
  targetNode: svg, ticks: TICKS, gap: GAP,
  x: X0, y: 0, label: "序列",
});

const aBrace = bracePath({
  targetNode: svg,
  fromX: axis.tickX(0), toX: axis.tickX(AT),
  y: 20,
  color: C.darkOrange,
  label: "a_i \\le x",
});
const bBrace = bracePath({
  targetNode: svg,
  fromX: axis.tickX(AT + 1), toX: axis.tickX(TICKS),
  y: 20,
  color: C.darkGreen,
  label: "a_i > x",
});

const lp = pointer(svg, axis.tickX(0), 0, "l", C.steelBlue, { above: true });
const rp = pointer(svg, axis.tickX(TICKS), 0, "r", C.steelBlue, { above: true });
const mp = pointer(svg, axis.tickX(0), -60, "mid", C.darkOrange);

sd.main(async () => {
  axis.fadeIn({ delay: 0 });
  aBrace.show({ delay: 300 });
  bBrace.show({ delay: 400 });
  lp.show(500);
  rp.show(600);
  await sd.pause();

  let l = 0;
  let r = TICKS;
  let midShown = false;
  while (l <= r) {
    const mid = (l + r) >> 1;
    if (!midShown) { mp.moveTo(axis.tickX(mid)); mp.show(); midShown = true; }
    else mp.moveTo(axis.tickX(mid));
    await sd.pause();
    if (mid <= AT) {
      l = mid + 1;
      lp.moveTo(axis.tickX(l));
    } else {
      r = mid - 1;
      rp.moveTo(axis.tickX(r));
    }
    await sd.pause();
  }
});
