import type { AABB } from "@/math/aabb";
import type { SDNode } from "@/node/node";

import { Root, svg } from "@/interact/root";
import { RenderNode } from "@/renderer/render-node";

export type PathCode =
  | "M"
  | "m"
  | "L"
  | "l"
  | "H"
  | "h"
  | "V"
  | "v"
  | "C"
  | "c"
  | "S"
  | "s"
  | "Q"
  | "q"
  | "T"
  | "t"
  | "A"
  | "a"
  | "Z"
  | "z";
export type PathOper = [PathCode, ...number[]];
export type PathOpers = Array<PathOper>;

export class PathEngine {
  static pathSVG = undefined;
  static init() {
    this.pathSVG = RenderNode.createRenderNodeWithoutAction(
      undefined,
      Root.svg,
      "path",
    );
    this.pathSVG.setAttribute("opacity", 0);
  }
  static toBox(d: string): AABB {
    this.pathSVG.setAttribute("d", this.flipY(d));
    const bbox = this.pathSVG.element().getBBox();
    return {
      x: bbox.x,
      y: -bbox.y - bbox.height,
      width: bbox.width,
      height: bbox.height,
    };
  }
  static flipY(d: string): string {
    const operators = this.toOpers(d);
    operators.forEach((operator) => {
      const code = operator[0];
      switch (code) {
        case "M":
        case "m":
        case "T":
        case "t":
        case "L":
        case "l":
          operator[2] = -(operator[2] as number);
          break;
        case "V":
        case "v":
          operator[1] = -(operator[1] as number);
          break;
        case "Q":
        case "q":
        case "S":
        case "s":
          operator[2] = -(operator[2] as number);
          operator[4] = -(operator[4] as number);
          break;
        case "C":
        case "c":
          operator[2] = -(operator[2] as number);
          operator[4] = -(operator[4] as number);
          operator[6] = -(operator[6] as number);
          break;
        case "A":
        case "a":
          operator[7] = -(operator[7] as number);
          break;
      }
    });
    return this.toString(operators);
  }
  // SVG path parameter counts per command letter (0 for Z which closes
  // the subpath without parameters).
  private static PARAM_COUNT: Record<PathCode, number> = {
    M: 2,
    m: 2,
    L: 2,
    l: 2,
    H: 1,
    h: 1,
    V: 1,
    v: 1,
    C: 6,
    c: 6,
    S: 4,
    s: 4,
    Q: 4,
    q: 4,
    T: 2,
    t: 2,
    A: 7,
    a: 7,
    Z: 0,
    z: 0,
  };
  // SVG path tokenizer: emit each command letter or each signed number
  // separately. Numbers can use decimal-only forms (".5"), trailing-dot
  // forms ("5.") and scientific notation, and a "-" / "+" may follow the
  // previous number with no separator (e.g. "10-20" = 10, -20).
  private static readonly TOKEN_RE =
    /([MmLlHhVvCcSsQqTtAaZz])|([+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?)/g;
  static toOpers(d: string): PathOpers {
    if (!d) return [];
    const tokens: Array<string> = [];
    PathEngine.TOKEN_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = PathEngine.TOKEN_RE.exec(d)) !== null) {
      tokens.push(match[1] ?? match[2]);
    }
    const operators: PathOpers = [];
    let i = 0;
    let lastCmd: PathCode | undefined;
    while (i < tokens.length) {
      let cmd: PathCode;
      if (/[A-Za-z]/.test(tokens[i])) {
        cmd = tokens[i] as PathCode;
        i++;
      } else if (lastCmd !== undefined) {
        // Implicit continuation: after a command emits its operator, more
        // numbers default to the same command letter — except M/m which
        // continue as L/l (per SVG spec).
        cmd = lastCmd === "M" ? "L" : lastCmd === "m" ? "l" : lastCmd;
      } else {
        throw new Error(`unexpected number "${tokens[i]}" at start of path`);
      }
      const n = PathEngine.PARAM_COUNT[cmd];
      const params: Array<number> = [];
      for (let j = 0; j < n; j++) {
        params.push(parseFloat(tokens[i + j]));
      }
      i += n;
      operators.push([cmd, ...params] as PathOper);
      lastCmd = cmd;
    }
    return operators;
  }
  // Convert any SVG path into an equivalent sequence of absolute
  // commands containing only M (subpath start) and C (cubic Bezier).
  // The Z/z command is expanded into a C that draws back to the most
  // recent subpath start. Arcs are approximated with cubic Beziers per
  // the SVG implementation notes (≤ π/2 per cubic).
  static toCubic(path: string | PathOpers): PathOpers {
    const ops = typeof path === "string" ? this.toOpers(path) : path;
    const out: PathOpers = [];
    let cx = 0;
    let cy = 0;
    let sx = 0;
    let sy = 0;
    let prevCubicC2x: number | undefined;
    let prevCubicC2y: number | undefined;
    let prevQuadC1x: number | undefined;
    let prevQuadC1y: number | undefined;
    const pushLine = (nx: number, ny: number) => {
      out.push(["C", cx, cy, nx, ny, nx, ny]);
    };
    for (const op of ops) {
      const code = op[0];
      const args = op.slice(1) as number[];
      let nx = cx;
      let ny = cy;
      switch (code) {
        case "M":
          nx = args[0];
          ny = args[1];
          out.push(["M", nx, ny]);
          sx = nx;
          sy = ny;
          break;
        case "m":
          nx = cx + args[0];
          ny = cy + args[1];
          out.push(["M", nx, ny]);
          sx = nx;
          sy = ny;
          break;
        case "L":
          nx = args[0];
          ny = args[1];
          pushLine(nx, ny);
          break;
        case "l":
          nx = cx + args[0];
          ny = cy + args[1];
          pushLine(nx, ny);
          break;
        case "H":
          nx = args[0];
          pushLine(nx, ny);
          break;
        case "h":
          nx = cx + args[0];
          pushLine(nx, ny);
          break;
        case "V":
          ny = args[0];
          pushLine(nx, ny);
          break;
        case "v":
          ny = cy + args[0];
          pushLine(nx, ny);
          break;
        case "C": {
          const c1x = args[0];
          const c1y = args[1];
          const c2x = args[2];
          const c2y = args[3];
          nx = args[4];
          ny = args[5];
          out.push(["C", c1x, c1y, c2x, c2y, nx, ny]);
          prevCubicC2x = c2x;
          prevCubicC2y = c2y;
          break;
        }
        case "c": {
          const c1x = cx + args[0];
          const c1y = cy + args[1];
          const c2x = cx + args[2];
          const c2y = cy + args[3];
          nx = cx + args[4];
          ny = cy + args[5];
          out.push(["C", c1x, c1y, c2x, c2y, nx, ny]);
          prevCubicC2x = c2x;
          prevCubicC2y = c2y;
          break;
        }
        case "S": {
          const c1x = prevCubicC2x !== undefined ? 2 * cx - prevCubicC2x : cx;
          const c1y = prevCubicC2y !== undefined ? 2 * cy - prevCubicC2y : cy;
          const c2x = args[0];
          const c2y = args[1];
          nx = args[2];
          ny = args[3];
          out.push(["C", c1x, c1y, c2x, c2y, nx, ny]);
          prevCubicC2x = c2x;
          prevCubicC2y = c2y;
          break;
        }
        case "s": {
          const c1x = prevCubicC2x !== undefined ? 2 * cx - prevCubicC2x : cx;
          const c1y = prevCubicC2y !== undefined ? 2 * cy - prevCubicC2y : cy;
          const c2x = cx + args[0];
          const c2y = cy + args[1];
          nx = cx + args[2];
          ny = cy + args[3];
          out.push(["C", c1x, c1y, c2x, c2y, nx, ny]);
          prevCubicC2x = c2x;
          prevCubicC2y = c2y;
          break;
        }
        case "Q": {
          const qx = args[0];
          const qy = args[1];
          nx = args[2];
          ny = args[3];
          out.push(...PathEngine.quadToCubic(cx, cy, qx, qy, nx, ny));
          prevQuadC1x = qx;
          prevQuadC1y = qy;
          break;
        }
        case "q": {
          const qx = cx + args[0];
          const qy = cy + args[1];
          nx = cx + args[2];
          ny = cy + args[3];
          out.push(...PathEngine.quadToCubic(cx, cy, qx, qy, nx, ny));
          prevQuadC1x = qx;
          prevQuadC1y = qy;
          break;
        }
        case "T": {
          const qx = prevQuadC1x !== undefined ? 2 * cx - prevQuadC1x : cx;
          const qy = prevQuadC1y !== undefined ? 2 * cy - prevQuadC1y : cy;
          nx = args[0];
          ny = args[1];
          out.push(...PathEngine.quadToCubic(cx, cy, qx, qy, nx, ny));
          prevQuadC1x = qx;
          prevQuadC1y = qy;
          break;
        }
        case "t": {
          const qx = prevQuadC1x !== undefined ? 2 * cx - prevQuadC1x : cx;
          const qy = prevQuadC1y !== undefined ? 2 * cy - prevQuadC1y : cy;
          nx = cx + args[0];
          ny = cy + args[1];
          out.push(...PathEngine.quadToCubic(cx, cy, qx, qy, nx, ny));
          prevQuadC1x = qx;
          prevQuadC1y = qy;
          break;
        }
        case "A": {
          nx = args[5];
          ny = args[6];
          out.push(
            ...PathEngine.arcToCubics(
              cx,
              cy,
              nx,
              ny,
              args[0],
              args[1],
              args[2],
              args[3] !== 0,
              args[4] !== 0,
            ),
          );
          break;
        }
        case "a": {
          nx = cx + args[5];
          ny = cy + args[6];
          out.push(
            ...PathEngine.arcToCubics(
              cx,
              cy,
              nx,
              ny,
              args[0],
              args[1],
              args[2],
              args[3] !== 0,
              args[4] !== 0,
            ),
          );
          break;
        }
        case "Z":
        case "z":
          nx = sx;
          ny = sy;
          pushLine(nx, ny);
          break;
      }
      if (code !== "C" && code !== "c" && code !== "S" && code !== "s") {
        prevCubicC2x = undefined;
        prevCubicC2y = undefined;
      }
      if (code !== "Q" && code !== "q" && code !== "T" && code !== "t") {
        prevQuadC1x = undefined;
        prevQuadC1y = undefined;
      }
      cx = nx;
      cy = ny;
    }
    return out;
  }

  // Quadratic → Cubic Bezier exact conversion. The two cubic control
  // points sit 1/3 of the way from each endpoint toward the quadratic
  // control point.
  private static quadToCubic(
    x0: number,
    y0: number,
    qx: number,
    qy: number,
    x1: number,
    y1: number,
  ): PathOpers {
    const c1x = x0 + (2 / 3) * (qx - x0);
    const c1y = y0 + (2 / 3) * (qy - y0);
    const c2x = x1 + (2 / 3) * (qx - x1);
    const c2y = y1 + (2 / 3) * (qy - y1);
    return [["C", c1x, c1y, c2x, c2y, x1, y1]];
  }

  // SVG arc → cubic Bezier approximation. Algorithm from the W3C
  // implementation notes (Appendix B): endpoint → center parameter-
  // ization, then split sweep into pieces of ≤ π/2 and emit one cubic
  // per piece.
  private static arcToCubics(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    rx: number,
    ry: number,
    xAxisRotationDeg: number,
    largeArc: boolean,
    sweep: boolean,
  ): PathOpers {
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    if (rx === 0 || ry === 0) return [["C", x1, y1, x2, y2, x2, y2]];
    const phi = (xAxisRotationDeg * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    // Step 1: transform to local coords
    const dx = (x1 - x2) / 2;
    const dy = (y1 - y2) / 2;
    const x1p = cosPhi * dx + sinPhi * dy;
    const y1p = -sinPhi * dx + cosPhi * dy;
    // Correct out-of-range radii
    const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if (lambda > 1) {
      const s = Math.sqrt(lambda);
      rx *= s;
      ry *= s;
    }
    // Step 2: center in local coords
    const sign = largeArc === sweep ? -1 : 1;
    const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
    const factor = sign * Math.sqrt(Math.max(0, num / den));
    const cxp = (factor * rx * y1p) / ry;
    const cyp = (-factor * ry * x1p) / rx;
    // Step 3: center in original coords
    const cxArc = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
    const cyArc = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;
    // Step 4: angles
    const angle = (ux: number, uy: number, vx: number, vy: number) => {
      const dot = ux * vx + uy * vy;
      const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
      const a = Math.acos(Math.min(1, Math.max(-1, dot / len)));
      return ux * vy - uy * vx < 0 ? -a : a;
    };
    const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
    let dTheta = angle(
      (x1p - cxp) / rx,
      (y1p - cyp) / ry,
      (-x1p - cxp) / rx,
      (-y1p - cyp) / ry,
    );
    if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI;
    if (sweep && dTheta < 0) dTheta += 2 * Math.PI;
    // Split into pieces of ≤ π/2
    const pieces = Math.max(1, Math.ceil(Math.abs(dTheta) / (Math.PI / 2)));
    const deltaPiece = dTheta / pieces;
    const t =
      ((4 / 3) * Math.tan(deltaPiece / 4)) /
      Math.max(1e-12, Math.abs(Math.tan(deltaPiece / 4)) * 1);
    // Tangent factor for the cubic Bezier approximation of a circular
    // arc piece of angular span deltaPiece on a unit circle.
    const alpha = (Math.sin(deltaPiece) * (Math.sqrt(4 + 3 * t * t) - 1)) / 3;
    const cubics: PathOpers = [];
    let theta = theta1;
    let prevX = x1;
    let prevY = y1;
    let prevTangentX =
      cosPhi * (-rx * Math.sin(theta)) - sinPhi * (ry * Math.cos(theta));
    let prevTangentY =
      sinPhi * (-rx * Math.sin(theta)) + cosPhi * (ry * Math.cos(theta));
    for (let i = 1; i <= pieces; i++) {
      theta = theta1 + i * deltaPiece;
      const xLocal = rx * Math.cos(theta);
      const yLocal = ry * Math.sin(theta);
      const xWorld = cosPhi * xLocal - sinPhi * yLocal + cxArc;
      const yWorld = sinPhi * xLocal + cosPhi * yLocal + cyArc;
      const tangentXLocal = -rx * Math.sin(theta);
      const tangentYLocal = ry * Math.cos(theta);
      const tangentXWorld = cosPhi * tangentXLocal - sinPhi * tangentYLocal;
      const tangentYWorld = sinPhi * tangentXLocal + cosPhi * tangentYLocal;
      cubics.push([
        "C",
        prevX + alpha * prevTangentX,
        prevY + alpha * prevTangentY,
        xWorld - alpha * tangentXWorld,
        yWorld - alpha * tangentYWorld,
        xWorld,
        yWorld,
      ]);
      prevX = xWorld;
      prevY = yWorld;
      prevTangentX = tangentXWorld;
      prevTangentY = tangentYWorld;
    }
    return cubics;
  }
  // Convert both paths to all-cubic form and align them to the same
  // number of cubic segments so caller can lerp them operator-by-
  // operator. Alignment splits the longest cubic in the shorter array
  // at t=0.5 using De Casteljau, repeating until the counts match.
  // Equalize op count between two paths so pathInterp can lerp them
  // op-by-op. Works in two passes:
  //
  //   1. Sub-path count alignment — if one side has fewer M operators,
  //      append a degenerate sub-path ([M x y, C x y x y x y]) anchored
  //      at that side's OWN first M. The missing sub-path therefore
  //      appears to grow out of the path's existing position during
  //      morph rather than popping in from the other side's coords.
  //   2. Per-sub-path cubic count alignment — splitLongestCubic does
  //      not know about M boundaries; running it globally on a flat op
  //      list can split a cubic in the wrong sub-path and leave op
  //      types misaligned. We split per-sub-path-pair instead.
  static toCubics(
    path1: string | PathOpers,
    path2: string | PathOpers,
  ): [PathOpers, PathOpers] {
    const aSubs = this.splitSubpaths(this.toCubic(path1));
    const bSubs = this.splitSubpaths(this.toCubic(path2));
    while (aSubs.length < bSubs.length)
      aSubs.push(PathEngine.degenerateAt(aSubs[0]));
    while (bSubs.length < aSubs.length)
      bSubs.push(PathEngine.degenerateAt(bSubs[0]));
    for (let i = 0; i < aSubs.length; i++) {
      while (
        aSubs[i].length < bSubs[i].length &&
        PathEngine.splitLongestCubic(aSubs[i])
      ) {}
      while (
        bSubs[i].length < aSubs[i].length &&
        PathEngine.splitLongestCubic(bSubs[i])
      ) {}
    }
    return [aSubs.flat() as PathOpers, bSubs.flat() as PathOpers];
  }

  // Split a flat op list into one PathOpers per sub-path. Each result
  // entry begins with an M (or m). Ops before the first M are dropped.
  static splitSubpaths(ops: PathOpers): PathOpers[] {
    const result: PathOpers[] = [];
    let current: PathOpers = [];
    for (const op of ops) {
      if (op[0] === "M" || op[0] === "m") {
        if (current.length) result.push(current);
        current = [op];
      } else if (current.length) {
        current.push(op);
      }
    }
    if (current.length) result.push(current);
    return result;
  }

  private static degenerateAt(ref: PathOpers): PathOpers {
    const m = ref[0];
    const x = m[1] as number;
    const y = m[2] as number;
    return [
      ["M", x, y],
      ["C", x, y, x, y, x, y],
    ];
  }

  // Find the cubic with the longest chord and replace it with its two
  // De Casteljau halves at t=0.5. Returns false if there are no cubics
  // to split (path is just [M]) so the caller's while-loop terminates.
  private static splitLongestCubic(path: PathOpers): boolean {
    let bestIdx = -1;
    let bestLen = -1;
    let prevX = path[0][1] as number;
    let prevY = path[0][2] as number;
    for (let i = 1; i < path.length; i++) {
      const op = path[i];
      if (op[0] !== "C") {
        prevX = op[op.length - 2] as number;
        prevY = op[op.length - 1] as number;
        continue;
      }
      const ex = op[5] as number;
      const ey = op[6] as number;
      const dx = ex - prevX;
      const dy = ey - prevY;
      const len = dx * dx + dy * dy;
      if (len > bestLen) {
        bestLen = len;
        bestIdx = i;
      }
      prevX = ex;
      prevY = ey;
    }
    if (bestIdx < 0) return false;
    let px = path[0][1] as number;
    let py = path[0][2] as number;
    for (let i = 1; i < bestIdx; i++) {
      px = path[i][path[i].length - 2] as number;
      py = path[i][path[i].length - 1] as number;
    }
    const op = path[bestIdx];
    const c1x = op[1] as number;
    const c1y = op[2] as number;
    const c2x = op[3] as number;
    const c2y = op[4] as number;
    const x = op[5] as number;
    const y = op[6] as number;
    const q0x = (px + c1x) / 2;
    const q0y = (py + c1y) / 2;
    const q1x = (c1x + c2x) / 2;
    const q1y = (c1y + c2y) / 2;
    const q2x = (c2x + x) / 2;
    const q2y = (c2y + y) / 2;
    const r0x = (q0x + q1x) / 2;
    const r0y = (q0y + q1y) / 2;
    const r1x = (q1x + q2x) / 2;
    const r1y = (q1y + q2y) / 2;
    const s0x = (r0x + r1x) / 2;
    const s0y = (r0y + r1y) / 2;
    path.splice(
      bestIdx,
      1,
      ["C", q0x, q0y, r0x, r0y, s0x, s0y],
      ["C", r1x, r1y, q2x, q2y, x, y],
    );
    return true;
  }
  static toString(operators: PathOpers): string {
    let ans = "";
    for (const operator of operators) {
      ans += operator[0];
      ans += operator.slice(1).join(",");
    }
    return ans;
  }
  static updatePath(
    d: string,
    x0: number,
    y0: number,
    dx: number,
    dy: number,
    sx: number,
    sy: number,
  ): string {
    const fx = (x: number) => (x - x0) * sx + x0 + dx;
    const fy = (y: number) => (y - y0) * sy + y0 + dy;
    const operators = this.toOpers(d);
    operators.forEach((operator) => {
      const code = operator[0];
      switch (code) {
        case "M":
        case "T":
        case "L": {
          const [x, y] = operator.slice(1) as [number, number];
          operator[1] = fx(x);
          operator[2] = fy(y);
          break;
        }
        case "H": {
          const x = operator[1];
          operator[1] = fx(x);
          break;
        }
        case "V": {
          const y = operator[1];
          operator[1] = fy(y);
          break;
        }
        case "Q":
        case "S": {
          const [x1, y1, x, y] = operator.slice(1) as [
            number,
            number,
            number,
            number,
          ];
          operator[1] = fx(x1);
          operator[2] = fy(y1);
          operator[3] = fx(x);
          operator[4] = fy(y);
          break;
        }
        case "C": {
          const [x1, y1, x2, y2, x, y] = operator.slice(1) as [
            number,
            number,
            number,
            number,
            number,
            number,
          ];
          operator[1] = fx(x1);
          operator[2] = fy(y1);
          operator[3] = fx(x2);
          operator[4] = fy(y2);
          operator[5] = fx(x);
          operator[6] = fy(y);
          break;
        }
        case "A": {
          operator[1] *= sx;
          operator[2] *= sy;
          operator[6] = fx(operator[6]);
          operator[7] = fy(operator[7]);
          break;
        }
      }
    });
    return this.toString(operators);
  }
  static getPointAtLength(d: string, length: number): [number, number] {
    try {
      this.pathSVG.setAttribute("d", d);
      const point = this.pathSVG.element().getPointAtLength(length);
      return [point.x, point.y];
    } catch (err) {
      return [0, 0];
    }
  }
  static getPointByRate(d: string, k: number): [number, number] {
    try {
      this.pathSVG.setAttribute("d", d);
      const length = this.pathSVG.element().getTotalLength() * k;
      const point = this.pathSVG.element().getPointAtLength(length);
      return [point.x, point.y];
    } catch (err) {
      return [0, 0];
    }
  }
  static getTotalLength(d: string) {
    try {
      this.pathSVG.setAttribute("d", d);
      return this.pathSVG.element().getTotalLength();
    } catch (err) {
      return 0;
    }
  }
  static __trimSource(source: SDNode) {
    if (!source) return 0;
    const t = this.pathSVG.element().getTotalLength();
    let l = 0;
    let r = 1;
    while (r - l > 1e-3) {
      const mid = (l + r) / 2.0;
      const length = t * mid;
      const point = this.pathSVG.element().getPointAtLength(length);
      if (source.containsPoint([point.x, point.y])) l = mid;
      else r = mid;
    }
    if (t * l <= 1) return 0;
    return l;
  }
  static __trimTarget(target: SDNode) {
    if (!target) return 1;
    const t = this.pathSVG.element().getTotalLength();
    let l = 0;
    let r = 1;
    while (r - l > 1e-3) {
      const mid = (l + r) / 2.0;
      const length = t * mid;
      const point = this.pathSVG.element().getPointAtLength(length);
      if (target.containsPoint([point.x, point.y])) r = mid;
      else l = mid;
    }
    if (t * (1 - l) <= 1) return 1;
    return l;
  }
  static trim(d: string, source: SDNode, target: SDNode) {
    try {
      this.pathSVG.setAttribute("d", d);
      const length = this.pathSVG.element().getTotalLength();
      const s = this.__trimSource(source);
      const t = this.__trimTarget(target);
      const ps = this.pathSVG.element().getPointAtLength(s * length);
      const pt = this.pathSVG.element().getPointAtLength(t * length);
      return [
        [ps.x, ps.y],
        [pt.x, pt.y],
      ];
    } catch (err) {
      return [
        [0, 0],
        [0, 0],
      ];
    }
  }
}
