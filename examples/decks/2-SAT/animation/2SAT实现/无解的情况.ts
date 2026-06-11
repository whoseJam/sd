import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const R = 24;
const Y = { cx: 0, cy: 50 };
const N = { cx: 0, cy: -50 };
const L = { cx: -110, cy: 0 };
const Rt = { cx: 110, cy: 0 };

function circle(cx: number, cy: number) {
  return new sd.Circle({
    targetNode: svg,
    cx,
    cy,
    r: R,
    fill: C.white,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.4,
    opacity: 0,
  });
}

function math(text: string, cx: number, cy: number, fontSize = 16) {
  return new sd.Math({
    targetNode: svg,
    text,
    cx,
    cy,
    fontSize,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
}

function text(t: string, cx: number, cy: number, fontSize = 16) {
  return new sd.Text({
    targetNode: svg,
    text: t,
    cx,
    cy,
    fontSize,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
}

function arrow(a: { cx: number; cy: number }, b: { cx: number; cy: number }) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const ax = a.cx + ux * R;
  const ay = a.cy + uy * R;
  const bx = b.cx - ux * R;
  const by = b.cy - uy * R;
  const line = new sd.Path({
    targetNode: svg,
    d: `M ${ax} ${ay} L ${bx} ${by}`,
    stroke: C.darkButtonGrey,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
  const headSize = 6;
  const px = -uy;
  const py = ux;
  const h1x = bx - ux * headSize + px * (headSize / 2);
  const h1y = by - uy * headSize + py * (headSize / 2);
  const h2x = bx - ux * headSize - px * (headSize / 2);
  const h2y = by - uy * headSize - py * (headSize / 2);
  const head = new sd.Path({
    targetNode: svg,
    d: `M ${bx} ${by} L ${h1x} ${h1y} L ${h2x} ${h2y} Z`,
    stroke: C.darkButtonGrey,
    strokeWidth: 1,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
  return [line, head];
}

const cY = circle(Y.cx, Y.cy);
const cN = circle(N.cx, N.cy);
const lY = math("Y_i", Y.cx, Y.cy);
const lN = math("N_i", N.cx, N.cy);
const lL = text("...", L.cx, L.cy);
const lR = text("...", Rt.cx, Rt.cy);

const a1 = arrow(Y, L);
const a2 = arrow(L, N);
const a3 = arrow(N, Rt);
const a4 = arrow(Rt, Y);

sd.main(async () => {
  const all = [cY, cN, lY, lN, lL, lR, ...a1, ...a2, ...a3, ...a4] as Array<
    sd.Circle | sd.Math | sd.Text | sd.Path
  >;
  for (let i = 0; i < all.length; i++) {
    all[i]
      .startAnimate({ delay: i * 24, duration: 280, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();
});
