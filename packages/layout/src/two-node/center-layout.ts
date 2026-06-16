import type { BoxNode, SizedBoxNode } from "@whosejam/sd-core";

import { Circle } from "@whosejam/sd-core";

interface CenterContentFitLayoutParam {
  rate?: number;
}

export function CenterLayout(lhs: BoxNode, rhs: BoxNode) {
  rhs.setCenter(lhs.getLocalCenter());
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

  const center = lhs.getLocalCenter();
  const [w, h] = [lhs.getLocalWidth(), lhs.getLocalHeight()];
  const cw = Math.max(rhs.getLocalWidth(), 1);
  const ch = Math.max(rhs.getLocalHeight(), 1);
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

  const center = lhs.getLocalCenter();
  const r = Math.min(lhs.getLocalWidth(), lhs.getLocalHeight()) / 2 / rate;
  const cw = Math.max(rhs.getLocalWidth(), 1);
  const ch = Math.max(rhs.getLocalHeight(), 1);
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

  const center = lhs.getLocalCenter();
  const [w, h] = [
    lhs.getLocalWidth() / 2 / rate,
    lhs.getLocalHeight() / 2 / rate,
  ];
  const cw = Math.max(rhs.getLocalWidth(), 1);
  const ch = Math.max(rhs.getLocalHeight(), 1);
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
