import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const data = [2, 4, 3, 4, 6, 2, 3, 4];
const N = data.length;
const TARGET = (N * (N + 1)) / 2;

const CELL = 36;
const PLANE = 38;
const GAP_V = 28;
const GAP_H = 50;
const PANEL_W = 200;
const AXIS_PAD = 10;
const ARROW = 5;
const TICK = 4;

const ARR_W = N * CELL;
const PLANE_W = N * PLANE;
const PLANE_H = N * PLANE;

const ARR_Y = 0;
const PLANE_X0 = 0;
const PLANE_Y0 = CELL + GAP_V + AXIS_PAD + ARROW + 12;
const ARR_X0 = PLANE_X0 + (PLANE_W - ARR_W) / 2;
const PANEL_X = PLANE_X0 + PLANE_W + GAP_H;
const PANEL_Y0 = PLANE_Y0;

const L_AXIS_Y = PLANE_Y0 + PLANE_H + AXIS_PAD;
const R_AXIS_X = PLANE_X0 - AXIS_PAD;

const TEXT_DARK = C.black;
const TEXT_DIM = C.darkGrey;
const AXIS_INK = C.darkGrey;
const RECT_FILL = C.green;
const RECT_STROKE = C.darkGreen;

const arrLeft = (i: number) => ARR_X0 + i * CELL;
const arrMid = (i: number) => ARR_X0 + (i + 0.5) * CELL;
const planeX = (l: number) => PLANE_X0 + l * PLANE;
// r is plotted upward (math convention) — r=0 sits at the bottom of the plane.
const planeY = (r: number) => PLANE_Y0 + (N - r) * PLANE;

const cells: sd.Rect[] = [];
const labels: sd.Text[] = [];
const gridLines: sd.Line[] = [];
const axisNodes: sd.SDNode[] = [];

let targetText: sd.Text;
let areaText: sd.Text;
let verdictText: sd.Text;

sd.init(() => {
  for (let i = 0; i <= N; i++) {
    gridLines.push(
      new sd.Line({
        targetNode: svg,
        x1: planeX(i),
        y1: PLANE_Y0,
        x2: planeX(i),
        y2: PLANE_Y0 + PLANE_H,
        stroke: C.silver,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
    gridLines.push(
      new sd.Line({
        targetNode: svg,
        x1: PLANE_X0,
        y1: planeY(i),
        x2: PLANE_X0 + PLANE_W,
        y2: planeY(i),
        stroke: C.silver,
        strokeWidth: 0.8,
        strokeDashArray: [2, 3],
        opacity: 0,
      }),
    );
  }

  const lAxisXEnd = PLANE_X0 + PLANE_W + AXIS_PAD + ARROW;
  axisNodes.push(
    new sd.Line({
      targetNode: svg,
      x1: PLANE_X0 - AXIS_PAD,
      y1: L_AXIS_Y,
      x2: lAxisXEnd,
      y2: L_AXIS_Y,
      stroke: AXIS_INK,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: lAxisXEnd,
      y1: L_AXIS_Y,
      x2: lAxisXEnd - ARROW,
      y2: L_AXIS_Y - 3,
      stroke: AXIS_INK,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: lAxisXEnd,
      y1: L_AXIS_Y,
      x2: lAxisXEnd - ARROW,
      y2: L_AXIS_Y + 3,
      stroke: AXIS_INK,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    new sd.Text({
      targetNode: svg,
      text: "l",
      cx: lAxisXEnd + 12,
      cy: L_AXIS_Y,
      fontSize: 18,
      fill: AXIS_INK,
      opacity: 0,
    }),
  );

  const rAxisYEnd = PLANE_Y0 - AXIS_PAD - ARROW;
  axisNodes.push(
    new sd.Line({
      targetNode: svg,
      x1: R_AXIS_X,
      y1: PLANE_Y0 + PLANE_H + AXIS_PAD,
      x2: R_AXIS_X,
      y2: rAxisYEnd,
      stroke: AXIS_INK,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: R_AXIS_X,
      y1: rAxisYEnd,
      x2: R_AXIS_X - 3,
      y2: rAxisYEnd + ARROW,
      stroke: AXIS_INK,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    new sd.Line({
      targetNode: svg,
      x1: R_AXIS_X,
      y1: rAxisYEnd,
      x2: R_AXIS_X + 3,
      y2: rAxisYEnd + ARROW,
      stroke: AXIS_INK,
      strokeWidth: 1.4,
      opacity: 0,
    }),
    new sd.Text({
      targetNode: svg,
      text: "r",
      cx: R_AXIS_X,
      cy: rAxisYEnd - 12,
      fontSize: 18,
      fill: AXIS_INK,
      opacity: 0,
    }),
  );

  for (let i = 0; i <= N; i++) {
    axisNodes.push(
      new sd.Line({
        targetNode: svg,
        x1: planeX(i),
        y1: L_AXIS_Y,
        x2: planeX(i),
        y2: L_AXIS_Y + TICK,
        stroke: AXIS_INK,
        strokeWidth: 1,
        opacity: 0,
      }),
      new sd.Text({
        targetNode: svg,
        text: String(i),
        cx: planeX(i),
        cy: L_AXIS_Y + TICK + 10,
        fontSize: 10,
        fill: TEXT_DIM,
        opacity: 0,
      }),
      new sd.Line({
        targetNode: svg,
        x1: R_AXIS_X,
        y1: planeY(i),
        x2: R_AXIS_X - TICK,
        y2: planeY(i),
        stroke: AXIS_INK,
        strokeWidth: 1,
        opacity: 0,
      }),
      new sd.Text({
        targetNode: svg,
        text: String(i),
        cx: R_AXIS_X - TICK - 8,
        cy: planeY(i),
        fontSize: 10,
        fill: TEXT_DIM,
        opacity: 0,
      }),
    );
  }

  for (let i = 0; i < N; i++) {
    cells.push(
      new sd.Rect({
        targetNode: svg,
        x: arrLeft(i),
        y: ARR_Y,
        width: CELL,
        height: CELL,
        fill: C.white,
        stroke: C.grey,
        strokeWidth: 1.5,
        opacity: 0,
      }),
    );
    labels.push(
      new sd.Text({
        targetNode: svg,
        text: String(data[i]),
        cx: arrMid(i),
        cy: ARR_Y + CELL / 2,
        fontSize: 18,
        fill: TEXT_DARK,
        opacity: 0,
      }),
    );
  }

  targetText = new sd.Text({
    targetNode: svg,
    text: `target  ${TARGET}`,
    cx: PANEL_X,
    cy: PANEL_Y0 + 20,
    fontSize: 16,
    fill: TEXT_DIM,
    textAnchor: "start",
    opacity: 0,
  });
  areaText = new sd.Text({
    targetNode: svg,
    text: "Σ area  0",
    cx: PANEL_X,
    cy: PANEL_Y0 + 52,
    fontSize: 18,
    fill: RECT_STROKE,
    textAnchor: "start",
    opacity: 0,
  });
  verdictText = new sd.Text({
    targetNode: svg,
    text: "",
    cx: PANEL_X,
    cy: PANEL_Y0 + 92,
    fontSize: 18,
    fill: TEXT_DARK,
    textAnchor: "start",
    opacity: 0,
  });
});

function bracket(a: number, b: number, side: "top" | "bottom", label: string) {
  const x1 = arrLeft(a);
  const x2 = arrLeft(b) + CELL;
  const baseY = side === "top" ? ARR_Y + CELL + 8 : ARR_Y - 8;
  const tickDir = side === "top" ? -5 : 5;
  const labelY = side === "top" ? baseY + 14 : baseY - 14;
  const items: sd.SDNode[] = [
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2, y2: baseY, stroke: C.blue, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1, y1: baseY, x2: x1, y2: baseY + tickDir, stroke: C.blue, strokeWidth: 1.5, opacity: 0 }),
    new sd.Line({ targetNode: svg, x1: x2, y1: baseY, x2, y2: baseY + tickDir, stroke: C.blue, strokeWidth: 1.5, opacity: 0 }),
    new sd.Text({ targetNode: svg, text: label, cx: (x1 + x2) / 2, cy: labelY, fontSize: 13, fill: C.blue, opacity: 0 }),
  ];
  for (const item of items) {
    item.startAnimate({ duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  return items;
}

function fadeOut(items: sd.SDNode[]) {
  for (const item of items) {
    item.startAnimate({ duration: 260, easing: E.easeOut }).setOpacity(0).endAnimate();
  }
}

sd.main(async () => {
  for (let k = 0; k < gridLines.length; k++) {
    gridLines[k]
      .startAnimate({ delay: k * 6, duration: 240, easing: E.easeOut })
      .setOpacity(0.35)
      .endAnimate();
  }
  for (let k = 0; k < axisNodes.length; k++) {
    axisNodes[k]
      .startAnimate({ delay: 240 + k * 8, duration: 260, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  const cellsStart = 240 + axisNodes.length * 8 + 80;
  for (let i = 0; i < N; i++) {
    cells[i].startAnimate({ delay: cellsStart + i * 45, duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
    labels[i].startAnimate({ delay: cellsStart + 80 + i * 45, duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
  }
  const panelStart = cellsStart + N * 45 + 120;
  targetText.startAnimate({ delay: panelStart, duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();
  areaText.startAnimate({ delay: panelStart + 120, duration: 260, easing: E.easeOut }).setOpacity(1).endAnimate();

  await sd.pause();

  let runningArea = 0;
  for (let i = 0; i < N; i++) {
    let L = -1;
    for (let k = i - 1; k >= 0; k--) if (data[k] === data[i]) { L = k; break; }
    let R = N;
    for (let k = i + 1; k < N; k++) if (data[k] === data[i]) { R = k; break; }

    if (i > 0) {
      cells[i - 1].startAnimate({ duration: 260, easing: E.easeOut }).setStroke(C.grey).endAnimate();
      labels[i - 1].startAnimate({ duration: 260, easing: E.easeOut }).setFill(TEXT_DARK).endAnimate();
    }
    cells[i].raise();
    labels[i].raise();
    cells[i].startAnimate({ duration: 260, easing: E.easeOut }).setStroke(C.red).endAnimate();
    labels[i].startAnimate({ duration: 260, easing: E.easeOut }).setFill(C.red).endAnimate();
    await sd.pause();

    const top = bracket(L + 1, i, "top", "[L+1, i]");
    const bot = bracket(i, R - 1, "bottom", "[i, R-1]");
    await sd.pause();

    const lo = L + 1;
    const hi = i;
    const ro = i;
    const rhi = R - 1;
    new sd.Rect({
      targetNode: svg,
      x: planeX(lo),
      y: planeY(rhi + 1),
      width: (hi - lo + 1) * PLANE,
      height: (rhi - ro + 1) * PLANE,
      fill: RECT_FILL,
      fillOpacity: 0,
      stroke: RECT_STROKE,
      strokeWidth: 1.4,
      strokeOpacity: 0,
    })
      .startAnimate({ duration: 320, easing: E.easeOut })
      .setFillOpacity(0.3)
      .setStrokeOpacity(0.85)
      .endAnimate();

    runningArea += (hi - lo + 1) * (rhi - ro + 1);
    areaText
      .startAnimate({ delay: 120, duration: 280, easing: E.easeOut })
      .setText(`Σ area  ${runningArea}`)
      .endAnimate();

    fadeOut(top);
    fadeOut(bot);
    await sd.pause();
  }

  cells[N - 1].startAnimate({ duration: 260, easing: E.easeOut }).setStroke(C.grey).endAnimate();
  labels[N - 1].startAnimate({ duration: 260, easing: E.easeOut }).setFill(TEXT_DARK).endAnimate();

  const ok = runningArea === TARGET;
  verdictText
    .startAnimate({ duration: 320, easing: E.easeOut })
    .setText(ok ? "✓ not boring" : "✗ boring")
    .setFill(ok ? RECT_STROKE : C.red)
    .setOpacity(1)
    .endAnimate();

  await sd.pause();
});
