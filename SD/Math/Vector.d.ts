export class Vector {
    static add(a: [number, number], b: [number, number]): [number, number];
    static sub(a: [number, number], b: [number, number]): [number, number];
    static dotMul(a: [number, number], b: [number, number]): number;
    static numberMul(a: [number, number], b: number): [number, number];
    static length(a: [number, number]): number;
    static identity(a: [number, number]): [number, number];
    static complexMul(a: [number, number], b: [number, number]): [number, number];
    static makeComplex(r: number, arc: number): [number, number];
    static rotate(a: [number, number], arc: number): [number, number];
    static norm(a: [number, number]): [number, number];
    static cross(a: [number, number], b: [number, number]): number;
    static onLeft(a: [number, number], b: [number, number]): boolean;
    static onRight(a: [number, number], b: [number, number]): boolean;
    static cos(a: [number, number]): number;
    static sin(a: [number, number]): number;
    static tan(a: [number, number]): number;
    static cohenSutherland(a: [number, number], b: [number, number], x: number, y: number, width: number, height: number): [[number, number], [number, number]];
    static intersect(point1: [number, number], direction1: number | [number, number], point2: [number, number], direction2: number | [number, number]): [boolean, [number, number]];
    static intersectLineWithLine(point1: [number, number], direction1: number | [number, number], point2: [number, number], direction2: number | [number, number]): [boolean, [number, number]];
    static intersectLineWithShootLine(point1: [number, number], direction1: number | [number, number], point2: [number, number], direction2: number | [number, number]): [boolean, [number, number]];
    static intersectLineWithSegment(point: [number, number], direction: number | [number, number], source: [number, number], target: [number, number]): [boolean, [number, number]];
    static intersectLineWithSegment(point: [number, number], direction: number | [number, number], segment: { x1: number; y1: number; x2: number; y2: number }): [boolean, [number, number]];
    static intersectLineWithBox(point: [number, number], direction: number | [number, number], box: { x: number; y: number; width: number; height: number }): [boolean, [number, number], [number, number]];
    static intersectLineWithBox(point: [number, number], direction: number | [number, number], x: number, y: number, width: number, height: number): [boolean, [number, number], [number, number]];
}

export function vec(): typeof Vector;
