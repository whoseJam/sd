import type { BoxNode, SizedBoxNode } from "@sd/core";

import { Circle } from "@sd/core";

interface CenterContentFitLayoutParam {
  rate?: number;
}

export function CenterLayout(lhs: BoxNode, rhs: BoxNode) {
  rhs.setCenter(lhs.getCenter());
}

export function CenterContentFitLayout(
  lhs: SizedBoxNode,
  rhs: SizedBoxNode,
  args?: CenterContentFitLayoutParam,
) {
  const { rate = 1.2 } = args ?? {};

  if (lhs instanceof Circle) {
    CenterCircleContentFitLayout(lhs, rhs, { rate });
  } else {
    CenterRectContentFitLayout(lhs, rhs, { rate });
  }
}

export function CenterRectContentFitLayout(
  lhs: SizedBoxNode,
  rhs: SizedBoxNode,
  args?: CenterContentFitLayoutParam,
) {
  const { rate = 1.2 } = args ?? {};

  const center = lhs.getCenter();
  const [w, h] = [lhs.getWidth(), lhs.getHeight()];
  const cw = Math.max(rhs.getWidth(), 1);
  const ch = Math.max(rhs.getHeight(), 1);
  const k = Math.min(w / cw, h / ch) / rate;

  rhs
    .setWidth(cw * k)
    .setHeight(ch * k)
    .setCenter(center);
}

export function CenterCircleContentFitLayout(
  lhs: SizedBoxNode,
  rhs: SizedBoxNode,
  args?: CenterContentFitLayoutParam,
) {
  const { rate = 1.2 } = args ?? {};

  const center = lhs.getCenter();
  const r = Math.min(lhs.getWidth(), lhs.getHeight()) / 2 / rate;
  const cw = Math.max(rhs.getWidth(), 1);
  const ch = Math.max(rhs.getHeight(), 1);
  const k = ch / cw;
  const w = 2 * Math.sqrt((r * r) / (k * k + 1));
  const h = w * k;

  rhs.setWidth(w).setHeight(h).setCenter(center);
}

export function CenterEllipseContentFitLayout(
  lhs: SizedBoxNode,
  rhs: SizedBoxNode,
  args?: CenterContentFitLayoutParam,
) {
  const { rate = 1.2 } = args ?? {};

  const center = lhs.getCenter();
  const [w, h] = [lhs.getWidth() / 2 / rate, lhs.getHeight() / 2 / rate];
  const cw = Math.max(rhs.getWidth(), 1);
  const ch = Math.max(rhs.getHeight(), 1);
  const k = Math.min(
    (2 * w) / cw,
    (2 * h) / ch,
    (2 * Math.sqrt(w * h)) / Math.sqrt(cw * ch),
  );

  rhs
    .setWidth(cw * k)
    .setHeight(ch * k)
    .setCenter(center);
}
