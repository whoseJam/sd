import type { SDBox, SDNode } from "@/Node/SDNode";

import { Root, svg } from "@/Interact/Root";
import { RenderNode } from "@/Renderer/RenderNode";

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
  static toBox(d: string): SDBox {
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
  static toCubic(path: string | PathOpers): PathOpers {
    // @ts-ignore
    return Snap.path.toCubic(path);
  }
  static toCubics(
    path1: string | PathOpers,
    path2: string | PathOpers,
  ): [PathOpers, PathOpers] {
    // @ts-ignore
    return Snap.path.toCubic(path1, path2);
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
      if (source.inRange([point.x, point.y])) l = mid;
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
      if (target.inRange([point.x, point.y])) r = mid;
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
