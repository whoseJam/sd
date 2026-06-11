import * as sd from "@/sd";

import { AXIS, fadeIn, NEUTRAL, NEUTRAL_STROKE } from "./style";

export const NODE_R = 12;
export const UNIT = 50;

export interface SceneItem {
  circle: sd.Circle | null;
  label: sd.Text | null;
  cx: number;
  cy: number;
}

export interface SceneOptions {
  positions: ([number, number] | number | null)[];
  fill: string;
  cyDefault?: number;
  showIndex?: boolean;
  indexStart?: number;
  indexFontSize?: number;
  scaleX?: number;
  scaleY?: number;
  baseY?: number;
  fontFill?: string;
}

export interface Scene {
  items: SceneItem[];
  n: number;
  cxOf: (i: number) => number;
  cyOf: (i: number) => number;
  fadeInAll: (baseDelay?: number, step?: number) => void;
}

export function makeScene(svg: sd.SDNode, opts: SceneOptions): Scene {
  const scaleX = opts.scaleX ?? UNIT;
  const scaleY = opts.scaleY ?? UNIT;
  const baseY = opts.baseY ?? 0;
  const fontFill = opts.fontFill ?? NEUTRAL_STROKE;
  const indexFontSize = opts.indexFontSize ?? 12;
  const n = opts.positions.length;
  const items: SceneItem[] = [];

  for (let i = 0; i < n; i++) {
    const p = opts.positions[i];
    if (p === null) {
      items.push({ circle: null, label: null, cx: 0, cy: baseY });
      continue;
    }
    const px = typeof p === "number" ? p : p[0];
    const py = typeof p === "number" ? 0 : p[1];
    const cx = px * scaleX;
    const cy = baseY + py * scaleY;
    const circle = new sd.Circle({
      targetNode: svg,
      cx,
      cy,
      r: NODE_R,
      fill: opts.fill,
      stroke: NEUTRAL,
      strokeWidth: 1.2,
      opacity: 0,
    });
    let label: sd.Text | null = null;
    if (opts.showIndex) {
      const idx = (opts.indexStart ?? 1) + i;
      label = new sd.Text({
        targetNode: svg,
        text: String(idx),
        cx,
        cy: cy - NODE_R - 12,
        fontSize: indexFontSize,
        fill: fontFill,
        opacity: 0,
      });
    }
    items.push({ circle, label, cx, cy });
  }

  return {
    items,
    n,
    cxOf: (i) => items[i].cx,
    cyOf: (i) => items[i].cy,
    fadeInAll(baseDelay = 0, step = 35) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].circle) fadeIn(items[i].circle!, baseDelay + i * step);
        if (items[i].label) fadeIn(items[i].label!, baseDelay + i * step + 60);
      }
    },
  };
}

export interface AxisOptions {
  xMin: number;
  xMax: number;
  cy?: number;
  scaleX?: number;
  withArrow?: boolean;
  yMax?: number;
  yScale?: number;
}

export function drawAxisX(svg: sd.SDNode, opts: AxisOptions): sd.Path {
  const scaleX = opts.scaleX ?? UNIT;
  const cy = opts.cy ?? 0;
  const x0 = opts.xMin * scaleX;
  const x1 = opts.xMax * scaleX + 14;
  let d = `M ${x0} ${cy} L ${x1} ${cy}`;
  if (opts.withArrow !== false)
    d += ` L ${x1 - 6} ${cy + 4} M ${x1} ${cy} L ${x1 - 6} ${cy - 4}`;
  return new sd.Path({
    targetNode: svg,
    d,
    stroke: AXIS,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
}

export function drawAxisY(svg: sd.SDNode, opts: AxisOptions): sd.Path {
  const yScale = opts.yScale ?? UNIT;
  const yMax = opts.yMax ?? 5;
  const x0 = opts.xMin * (opts.scaleX ?? UNIT);
  const y0 = opts.cy ?? 0;
  const y1 = y0 + yMax * yScale + 14;
  let d = `M ${x0} ${y0} L ${x0} ${y1}`;
  if (opts.withArrow !== false)
    d += ` L ${x0 - 4} ${y1 - 6} M ${x0} ${y1} L ${x0 + 4} ${y1 - 6}`;
  return new sd.Path({
    targetNode: svg,
    d,
    stroke: AXIS,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
}
