import { svg } from "@/Interact/Root";
import { Path } from "@/Node/Path/Path";
import { BooleanOperations, Polygon as PolygonLogic } from "@flatten-js/core";

function ddcmp(x) {
    if (Math.abs(x) > 1e-2) return 1;
    return Math.abs(x) < -1e-2 ? -1 : 0;
}

export class Vector {
    static add(a, b) {
        if (a.length === 2) return [a[0] + b[0], a[1] + b[1]];
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }
    static sub(a, b) {
        if (a.length === 2) return [a[0] - b[0], a[1] - b[1]];
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }
    static dotMul(a, b) {
        if (a.length === 2) return a[0] * b[0] + a[1] * b[1];
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    static numberMul(a, b) {
        if (a.length === 2) return [a[0] * b, a[1] * b];
        return [a[0] * b, a[1] * b, a[2] * b];
    }
    static length(a) {
        if (a.length === 2) return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
        return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    }
    static identity(a) {
        const length = this.length(a);
        if (a.length === 2) return ddcmp(length) > 0 ? [a[0] / length, a[1] / length] : [0, 0];
        return ddcmp(length) > 0 ? [a[0] / length, a[1] / length, a[2] / length] : [0, 0, 0];
    }
    static complexMul(a, b) {
        return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] - a[1] * b[0]];
    }
    static makeComplex(r, arc) {
        return [r * Math.cos(arc), r * Math.sin(arc)];
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
                const codeOut = codeA ? codeA : codeB;
                if (codeOut & TOP) {
                    x1 = a[0] + ((b[0] - a[0]) * (my - a[1])) / (b[1] - a[1]);
                    y1 = my;
                } else if (codeOut & BOTTOM) {
                    x1 = a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
                    y1 = y;
                } else if (codeOut & RIGHT) {
                    y1 = a[1] + ((b[1] - a[1]) * (mx - a[0])) / (b[0] - a[0]);
                    x1 = mx;
                } else if (codeOut & LEFT) {
                    y1 = a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
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
        if (!accepted) return undefined;
        return [a, b];
    }
    static intersectRayWithSegment(point, direction, a, b) {
        const ab = this.sub(b, a);
        const t = -this.cross(this.sub(a, point), direction) / this.cross(ab, direction);
        const u = -this.cross(this.sub(point, a), ab) / this.cross(direction, ab);
        if (0 <= t && t <= 1 && u >= 0) return this.add(a, this.numberMul(ab, t));
        return undefined;
    }
    static intersectRayWithBox(point, direction, x, y, width, height) {
        const p = [
            [x, y],
            [x, y + height],
            [x + width, y + height],
            [x + width, y],
        ];
        const answer = [];
        for (let i = 0; i < p.length; i++) {
            const intersect = this.intersectRayWithSegment(point, direction, p[i], p[(i + 1) % p.length]);
            if (intersect !== undefined) answer.push(intersect);
        }
        return answer;
    }

    static polyIntersect(polygons) {
        if (!Array.isArray(polygons) && arguments.length > 1) return this.polyIntersect(arguments);
        let result = castAnyToPologonLogic(polygons[0]);
        for (let i = 1; i < polygons.length; i++) {
            const polygon = castAnyToPologonLogic(polygons[i]);
            result = BooleanOperations.intersect(result, polygon);
        }
        return castPolygonLogicToPath(result);
    }
    static polyIntersectLogic(polygons) {
        if (!Array.isArray(polygons) && arguments.length > 1) return this.polyIntersectLogic(arguments);
        let result = castAnyToPologonLogic(polygons[0]);
        for (let i = 1; i < polygons.length; i++) {
            const polygon = castAnyToPologonLogic(polygons[i]);
            result = BooleanOperations.intersect(result, polygon);
        }
        return result;
    }
    static polyUnion(polygons) {
        if (!Array.isArray(polygons) && arguments.length > 1) return this.polyUnion(arguments);
        let result = castAnyToPologonLogic(polygons[0]);
        for (let i = 1; i < polygons.length; i++) {
            const polygon = castAnyToPologonLogic(polygons[i]);
            result = BooleanOperations.unify(result, polygon);
        }
        return castPolygonLogicToPath(result);
    }
    static polyUnionLogic(polygons) {
        if (!Array.isArray(polygons) && arguments.length > 1) return this.polyUnionLogic(arguments);
        let result = castAnyToPologonLogic(polygons[0]);
        for (let i = 1; i < polygons.length; i++) {
            const polygon = castAnyToPologonLogic(polygons[i]);
            result = BooleanOperations.unify(result, polygon);
        }
        return result;
    }
    static polySubtract(a, b) {
        return castPolygonLogicToPath(this.polySubtractLogic(a, b));
    }
    static polySubtractLogic(a, b) {
        a = castAnyToPologonLogic(a);
        b = castAnyToPologonLogic(b);
        return BooleanOperations.subtract(a, b);
    }
}

function castAnyToPologonLogic(object) {
    return object instanceof PolygonLogic ? object : object.toPolygon();
}

function castPolygonLogicToPath(polygon) {
    const str = polygon.svg();
    const regex = /d="([^"]*)"/;
    const match = str.match(regex);
    const d = match[1];
    const path = new Path(svg()).d(d).fillOpacity(1);
    path.toPolygon = function () {
        return polygon;
    };
    return path;
}

export function vec() {
    return Vector;
}
