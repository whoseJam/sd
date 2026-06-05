import * as sd from "@/sd";

// Small upward-pointing triangle that sits just below a CharRow cell.
// Lives directly inside the target group (no wrapper) so the polygon enters
// the action-list and contributes to the auto-fit world bbox; otherwise the
// pure-static polygon never registers and the viewBox crops it.

const C = sd.color();

export interface PointerOpts {
  targetNode: sd.Group;
  cx: number;
  topY: number;     // math-y of the triangle's top vertex
  size?: number;
  fill?: sd.SDColor;
  opacity?: number;
}

export class Pointer {
  readonly tri: sd.Polygon;
  readonly initCx: number;

  constructor(opts: PointerOpts) {
    this.initCx = opts.cx;
    const size = opts.size ?? 10;
    this.tri = new sd.Polygon({
      targetNode: opts.targetNode,
      points: [
        [opts.cx, opts.topY],
        [opts.cx - size / 2, opts.topY - size],
        [opts.cx + size / 2, opts.topY - size],
      ],
      fill: opts.fill ?? C.steelBlue,
      stroke: C.none,
      opacity: opts.opacity ?? 0,
    });
  }

  dxTo(cx: number): number {
    return cx - this.initCx;
  }
}
