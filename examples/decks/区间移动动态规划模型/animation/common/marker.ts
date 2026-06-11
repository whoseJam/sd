import * as sd from "@/sd";

import type { Scene } from "./scene";

import { NODE_R } from "./scene";
import { ACTIVE, fadeIn, NEUTRAL } from "./style";

const BRACE_DROP = 6;
const BRACE_TAB = 5;

export interface BraceOptions {
  from: number;
  to: number;
  label?: string;
  labelFontSize?: number;
  liftAboveTop?: number;
}

export interface Brace {
  path: sd.Path;
  label: sd.Math | null;
  cy: number;
}

export function makeBrace(
  svg: sd.SDNode,
  scene: Scene,
  opts: BraceOptions,
): Brace {
  const left = scene.cxOf(opts.from);
  const right = scene.cxOf(opts.to);
  const top = Math.max(scene.cyOf(opts.from), scene.cyOf(opts.to));
  const lift = opts.liftAboveTop ?? 26;
  const cy = top + NODE_R + lift;
  const cx = (left + right) / 2;
  const d = [
    `M ${left} ${cy}`,
    `L ${left} ${cy + BRACE_DROP}`,
    `L ${cx - BRACE_TAB} ${cy + BRACE_DROP}`,
    `L ${cx} ${cy + BRACE_DROP + BRACE_TAB}`,
    `L ${cx + BRACE_TAB} ${cy + BRACE_DROP}`,
    `L ${right} ${cy + BRACE_DROP}`,
    `L ${right} ${cy}`,
  ].join(" ");
  const path = new sd.Path({
    targetNode: svg,
    d,
    stroke: NEUTRAL,
    strokeWidth: 1.2,
    fill: "none",
    opacity: 0,
  });
  let label: sd.Math | null = null;
  if (opts.label) {
    label = new sd.Math({
      targetNode: svg,
      text: opts.label,
      cx,
      cy: cy + BRACE_DROP + BRACE_TAB + 14,
      fontSize: opts.labelFontSize ?? 13,
      fill: NEUTRAL,
      opacity: 0,
    });
  }
  return { path, label, cy };
}

export function fadeInBrace(brace: Brace, delay = 0) {
  fadeIn(brace.path, delay);
  if (brace.label) fadeIn(brace.label, delay + 60);
}

export interface EndpointOptions {
  idx: number;
  label: string;
  cyOffset?: number;
  fontSize?: number;
  fill?: string;
}

export interface Endpoint {
  arrow: sd.Path;
  label: sd.Text;
}

export function makeEndpoint(
  svg: sd.SDNode,
  scene: Scene,
  opts: EndpointOptions,
): Endpoint {
  const cx = scene.cxOf(opts.idx);
  const cy = scene.cyOf(opts.idx) - NODE_R - (opts.cyOffset ?? 10);
  const fill = opts.fill ?? ACTIVE;
  const arrow = new sd.Path({
    targetNode: svg,
    d: `M ${cx} ${cy} L ${cx - 4} ${cy - 8} L ${cx + 4} ${cy - 8} Z`,
    fill,
    stroke: "none",
    opacity: 0,
  });
  const label = new sd.Text({
    targetNode: svg,
    text: opts.label,
    cx,
    cy: cy - 18,
    fontSize: opts.fontSize ?? 13,
    fill,
    opacity: 0,
  });
  return { arrow, label };
}

export function fadeInEndpoint(ep: Endpoint, delay = 0) {
  fadeIn(ep.arrow, delay);
  fadeIn(ep.label, delay + 60);
}
