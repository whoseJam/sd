import * as sd from "@/sd";

import { Axis, bracePath } from "../lib/axis";

const svg = sd.svg();
const C = sd.color();

const TICKS = 20;
const GAP = 24;
const X0 = -(TICKS * GAP) / 2;
const AT = 12;

const axis = new Axis({
  targetNode: svg,
  ticks: TICKS,
  gap: GAP,
  x: X0,
  y: 0,
  label: "序列",
});

const aBrace = bracePath({
  targetNode: svg,
  fromX: axis.tickX(0),
  toX: axis.tickX(AT),
  y: 20,
  color: C.darkOrange,
  label: "a_i < x",
});
const bBrace = bracePath({
  targetNode: svg,
  fromX: axis.tickX(AT + 1),
  toX: axis.tickX(TICKS),
  y: 20,
  color: C.darkGreen,
  label: "a_i \\ge x",
});

sd.main(async () => {
  axis.fadeIn({ delay: 0 });
  aBrace.show({ delay: 300 });
  bBrace.show({ delay: 400 });
  await sd.pause();
});
