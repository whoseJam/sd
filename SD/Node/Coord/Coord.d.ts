import { BaseCoord } from "@/Node/Coord/BaseCoord";
import { Path } from "@/Node/Path/PathSVG";
import { Circle } from "@/Node/Shape/CircleSVG";
import { Rect } from "@/Node/Shape/RectSVG";

type Origin = "bl" | "c";

export class Coord extends BaseCoord {
    origin(): Origin;
    origin(origin: Origin): this;

    drawRect(x: number, y: number, width: number, height: number): Rect;
    rectX(rect: Rect): number | undefined;
    rectX(rect: Rect, x: number): this;
    rectY(rect: Rect): number | undefined;
    rectY(rect: Rect, y: number): this;
    rectWidth(rect: Rect): number | undefined;
    rectWidth(rect: Rect, width: number): this;
    rectHeight(rect: Rect): number | undefined;
    rectHeight(rect: Rect, height: number): this;

    drawCircle(x: number, y: number): Circle;
    circleX(circle: Circle): number | undefined;
    circleX(circle: Circle, x: number): this;
    circleY(circle: Circle): number | undefined;
    circleY(circle: Circle, y: number): this;

    drawFunction(func: (x: number) => number): Path;
    function(path: Path): (x: number) => number;
    function(path: Path, func: (x: number) => number): this;
    functionSampleCount(path: Path): number;
    functionSampleCount(path: Path, count: number): this;

    drawLine(x: number, y: number, dx: number, dy: number): Path;
    drawLine(x: number, y: number, d: [number, number]): Path;
    drawLine(v: [number, number], dx: number, dy: number): Path;
    drawLine(v: [number, number], d: [number, number]): Path;
    lineDirection(line: Path): [number, number];
    lineDirection(line: Path, dx: number, dy: number): this;
    lineDirection(line: Path, d: [number, number]): this;
    linePosition(line: Path): [number, number];
    linePosition(line: Path, x: number, y: number): this;
    linePosition(line: Path, v: [number, number]): this;
    lineSampleCount(ray: Path): number;
    lineSampleCount(ray: Path, count: number): this;

    drawRay(x: number, y: number, dx: number, dy: number): Path;
    drawRay(x: number, y: number, d: [number, number]): Path;
    drawRay(v: [number, number], dx: number, dy: number): Path;
    drawRay(v: [number, number], d: [number, number]): Path;
    rayDirection(ray: Path): [number, number];
    rayDirection(ray: Path, dx: number, dy: number): this;
    rayDirection(ray: Path, d: [number, number]): this;
    rayPosition(ray: Path): [number, number];
    rayPosition(ray: Path, x: number, y: number): this;
    rayPosition(ray: Path, d: [number, number]): this;
    raySampleCount(ray: Path): number;
    raySampleCount(ray: Path, count: number): this;
}
