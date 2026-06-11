import * as sd from "@/sd";

import type { Scene } from "./scene";

import { NODE_R } from "./scene";
import { ACTIVE, fadeIn, fadeOut, setStroke, setStrokeWidth } from "./style";

export interface TransOptions {
  from: number;
  to: number;
  label: string;
  arcOffset?: number;
  labelFontSize?: number;
  arrowColor?: string;
}

function arcD(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  lift: number,
): string {
  const mx = (x0 + x1) / 2;
  const my = Math.max(y0, y1) + lift;
  return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
}

export async function playTrans(
  svg: sd.SDNode,
  scene: Scene,
  opts: TransOptions,
) {
  const src = scene.items[opts.from];
  const dst = scene.items[opts.to];
  if (!src.circle || !dst.circle) return;

  const lift = opts.arcOffset ?? 26;
  const arrowColor = opts.arrowColor ?? ACTIVE;
  const fontSize = opts.labelFontSize ?? 13;

  const startX = src.cx;
  const startY = src.cy + NODE_R;
  const endX = dst.cx;
  const endY = dst.cy + NODE_R;

  const arc = new sd.Path({
    targetNode: svg,
    d: arcD(startX, startY, endX, endY, lift),
    stroke: arrowColor,
    strokeWidth: 1.4,
    fill: "none",
    opacity: 0,
  });

  const midX = (startX + endX) / 2;
  const midY = Math.max(startY, endY) + lift + 6;
  const label = new sd.Math({
    targetNode: svg,
    text: opts.label,
    cx: midX,
    cy: midY,
    fontSize,
    fill: arrowColor,
    opacity: 0,
  });

  setStroke(src.circle, ACTIVE);
  setStrokeWidth(src.circle, 2.2);
  fadeIn(arc, 120);
  fadeIn(label, 200);
  await sd.pause();

  setStroke(src.circle, "#000");
  setStrokeWidth(src.circle, 1.2);
  fadeOut(arc, 0);
  fadeOut(label, 0);
}
