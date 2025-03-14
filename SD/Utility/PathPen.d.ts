export class PathPen {
    MoveTo(v: [number, number]): this;
    MoveTo(x: number, y: number): this;
    moveTo(dv: [number, number]): this;
    moveTo(dx: number, dy: number): this;

    LinkTo(v: [number, number]): this;
    LinkTo(x: number, y: number): this;
    linkTo(dv: [number, number]): this;
    linkTo(dx: number, dy: number): this;

    Cubic(v1: [number, number], v2: [number, number], v: [number, number]): this;
    Cubic(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this;
    cubic(dv1: [number, number], dv2: [number, number], dv: [number, number]): this;
    cubic(dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number): this;

    Quad(v1: [number, number], v: [number, number]): this;
    Quad(x1: number, y1: number, x: number, y: number): this;
    quad(dv1: [number, number], dv: [number, number]): this;
    quad(dx1: number, dy1: number, dx: number, dy: number): this;

    Arc(r: [number, number], xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, v: [number, number]): this;
    Arc(rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, x: number, y: number): this;
    arc(r: [number, number], xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, dv: [number, number]): this;
    arc(rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, dx: number, dy: number): this;

    toString(): string;
}