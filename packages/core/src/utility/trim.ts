import type { SDNode } from "@/node/node";
import type { Path } from "@/node/path/path";

import { PathPen } from "@/node/path/path-pen";

const EPS = 1e-3;
const RESAMPLE_COUNT = 32;

function findExitRate(link: Path, source: SDNode): number {
  let l = 0;
  let r = 1;
  while (r - l > EPS) {
    const mid = (l + r) / 2;
    if (source.containsPoint(link.getPointAtRate(mid))) l = mid;
    else r = mid;
  }
  if (link.totalLength() * l <= 1) return 0;
  return l;
}

function findEnterRate(link: Path, target: SDNode): number {
  let l = 0;
  let r = 1;
  while (r - l > EPS) {
    const mid = (l + r) / 2;
    if (target.containsPoint(link.getPointAtRate(mid))) r = mid;
    else l = mid;
  }
  if (link.totalLength() * (1 - l) <= 1) return 1;
  return l;
}

export function trim(
  link: Path,
  source: SDNode | null | undefined,
  target: SDNode | null | undefined,
): void {
  const s = source ? findExitRate(link, source) : 0;
  const t = target ? findEnterRate(link, target) : 1;
  if (s >= t) return;
  if (s === 0 && t === 1) return;

  const pen = new PathPen().MoveTo(link.getPointAtRate(s));
  for (let i = 1; i <= RESAMPLE_COUNT; i++) {
    const k = s + ((t - s) * i) / RESAMPLE_COUNT;
    pen.LineTo(link.getPointAtRate(k));
  }
  link.setD(pen.toString());
}
