import { Check } from "@/Utility/Check";

function ddcmp(x) {
    if (Math.abs(x) > 1e-2) return 1;
    return Math.abs(x) < -1e-2 ? -1 : 0;
}

export class Vector {

    static getIns() {
        return Vector;
    }

    static add(a, b) {
        return [
            a[0] + b[0],
            a[1] + b[1]
        ];
    }

    static sub(a, b) {
        return [
            a[0] - b[0],
            a[1] - b[1]
        ];
    }

    static dotMul(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }

    static numberMul(a, b) {
        return [a[0] * b, a[1] * b];
    }

    static length(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    }

    static identity(a) {
        const length = this.length(a);
        if (ddcmp(length) > 0) {
            return [
                a[0] / length,
                a[1] / length
            ];
        }
        return [0, 0];
    }

    static complexMul(a, b) {
        return [
            a[0] * b[0] - a[1] * b[1],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    static makeComplex(r, arc) {
        return [
            r * Math.cos(arc),
            r * Math.sin(arc)
        ];
    }

    static rotate(a, arc) {
        const direction = this.makeComplex(1, arc);
        return this.complexMul(a, direction);
    }

    static norm(a) {
        return this.identity(a);
    }

    static cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }

    static onLeft(a, b) {
        return this.cross(a, b) >= 0;
    }

    static onRight(a, b) {
        return this.cross(a, b) <= 0;
    }

    static cos(a) {
        return a[0] / this.length(a);
    }

    static sin(a) {
        return a[1] / this.length(a);
    }

    static tan(a) {
        return a[1] / a[0];
    }

    static cohenSutherland(a, b, x, y, width, height) {
        const INSIDE = 0;
        const LEFT = 1;
        const RIGHT = 2;
        const BOTTOM = 4;
        const TOP = 8;
        const mx = x + width;
        const my = y + height;
        function computeCode(x0, y0) {
            let code = INSIDE;
            if (x0 < x) code |= LEFT;
            if (x0 > mx) code |= RIGHT;
            if (y0 < y) code |= BOTTOM;
            if (y0 > my) code |= TOP;
            return code;
        }
        let codeA = computeCode(a[0], a[1]);
        let codeB = computeCode(b[0], b[1]);
        let accepted = false;
        while (true) {
            if (codeA === INSIDE && codeB === INSIDE) {
                accepted = true;
                break;
            } else if (codeA & codeB) {
                break;
            } else {
                let x1, y1;
                const codeOut = (codeA) ? codeA : codeB;
                if (codeOut & TOP) {
                    x1 = a[0] + (b[0] - a[0]) * (my - a[1]) / (b[1] - a[1]);
                    y1 =  my;
                } else if (codeOut & BOTTOM) {
                    x1 = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]);
                    y1 = y;
                } else if (codeOut & RIGHT) {
                    y1 = a[1] + (b[1] - a[1]) * (mx - a[0]) / (b[0] - a[0]);
                    x1 = mx;
                } else if (codeOut & LEFT) {
                    y1 = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
                    x1 = x;
                }
                if (codeOut === codeA) {
                    a = [x1, y1];
                    codeA = computeCode(x1, y1);
                } else {
                    b = [x1, y1];
                    codeB = computeCode(x1, y1);
                }
            }
        }
        return [a, b, accepted];
    }
    static intersectLineWithLine = IntersectLineWithLine;
    static intersectLineWithShootLine = IntersectLineWithShootLine;
    static intersectLineWithSegment = IntersectLineWithSegment;
    static intersectLineWithBox = IntersectLineWithBox;
}

function CastKToDirection(k) {
    if (k === Infinity || k === -Infinity) return [0, 1];
    return Vector.norm([1, k]);
}

function IntersectLineWithLine(point1, direction1, point2, direction2) {
    if (typeof(direction1) === "number") direction1 = CastKToDirection(direction1);
    if (typeof(direction2) === "number") direction2 = CastKToDirection(direction2);
    // Cross(p1+xd1-p2,d2)=0
    const x = - Vector.cross(Vector.sub(point1, point2), direction2) / Vector.cross(direction1, direction2);
    return [true, Vector.add(point1, Vector.numberMul(direction1, x))];
}

function IntersectLineWithShootLine(point1, direction1, point2, direction2) {
    if (typeof(direction1) === "number") direction1 = CastKToDirection(direction1);
    if (typeof(direction2) === "number") direction2 = CastKToDirection(direction2);
    // Cross(p2+xd2-p1,d1)=0
    const x = - Vector.cross(Vector.sub(point2, point1), direction1) / Vector.cross(direction2, direction1);
    return [x >= 0, Vector.add(point2, Vector.numberMul(direction2, x))];
}

function IntersectLineWithSegment(point, direction, source, target) {
    if (arguments.length === 3) return IntersectLineWithSegment(point, direction, [source.x1, source.y1], [source.x2, source.y2]);
    if (typeof(direction) === "number") direction = CastKToDirection(direction);
    const dst = Vector.sub(target, source);
    const x = - Vector.cross(Vector.sub(source, point), direction) / Vector.cross(Vector.norm(dst), direction);
    return [0 <= x && x <= Vector.length(dst), Vector.add(source, Vector.numberMul(Vector.norm(dst), x))];

}

function IntersectLineWithBox(point, direction, x, y, width, height) {
    if (arguments.length === 3) return IntersectLineWithBox(point, direction, x.x, x.y, x.width, x.height);
    if (typeof(direction) === "number") direction = CastKToDirection(direction);
    const [successA, A] = IntersectLineWithSegment(point, direction, [x, y], [x + width, y]);
    const [successB, B] = IntersectLineWithSegment(point, direction, [x + width, y], [x + width, y + height]);
    const [successC, C] = IntersectLineWithSegment(point, direction, [x + width, y + height], [x, y + height]);
    const [successD, D] = IntersectLineWithSegment(point, direction, [x, y], [x, y + height]);
    const result = [];
    if (successA) result.push(A);
    if (successB) result.push(B);
    if (successC) result.push(C);
    if (successD) result.push(D);
    if (result.length === 0) return [false, [0, 0], [0, 0]];
    if (result.length === 1) return [true, result[0], result[0]];
    return [true, result[0], result[1]];
}

export function vec() {
    return Vector;
}