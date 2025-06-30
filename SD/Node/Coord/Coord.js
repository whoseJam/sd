import { dqual } from "@/Math/Math";
import { Vector as V } from "@/Math/Vector";
import { Axis } from "@/Node/Axis/Axis";
import { BaseCoord } from "@/Node/Coord/BaseCoord";
import { Enter as EN } from "@/Node/Core/Enter";
import { Path } from "@/Node/Path/Path";
import { CircleSVG } from "@/Node/Shape/CircleSVG";
import { RectSVG } from "@/Node/Shape/RectSVG";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";
import { PathPen } from "@/Utility/PathPen";

export class Coord extends BaseCoord {
    constructor(target, prevent = false) {
        super(target);

        this.type("Coord");

        this.vars.merge({
            origin: "bl",
        });

        if (!prevent) {
            this.childAs("x", new Axis(this).direction(1, 0).withTickLabel(true), (parent, child) => {
                if (this.origin() === "bl") child.source(parent.pos("x", "my"));
                else if (this.origin() === "c") child.source(parent.pos("x", "cy"));
                child.length(parent.width());
            });
            this.childAs("y", new Axis(this).direction(0, -1).withTickLabel(true).tickLabelAlign("target"), (parent, child) => {
                if (this.origin() === "bl") child.source(parent.pos("x", "my"));
                else if (this.origin() === "c") child.source(parent.pos("cx", "my"));
                child.length(parent.height());
            });
        }
    }
}

function elementProp1(key) {
    return function (element, value) {
        const _element = this.__getElement(element);
        if (arguments.length === 1) return _element[key];
        _element[key] = value;
        return this;
    };
}

function elementProp2(key) {
    return function (element, v1, v2) {
        const _element = this.__getElement(element);
        if (arguments.length === 1) return _element[key];
        if (arguments.length === 2) [v1, v2] = [v1[0], v1[1]];
        _element[key] = [v1, v2];
        return this;
    };
}

Object.assign(Coord.prototype, {
    axis(by) {
        return this.child(by);
    },
    local(x, y) {
        if (arguments.length === 1) return this.local(x[0], x[1]);
        return [this.axis("x").local(x, y), this.axis("y").local(x, y)];
    },
    global(x, y) {
        if (arguments.length === 1) return this.global(x[0], x[1]);
        return [this.axis("x").globalX(x), this.axis("y").globalY(y)];
    },
    origin: Factory.handler("origin"),
    drawRect(x, y, width, height) {
        const rect = new RectSVG(this).opacity(0).onEnter(EN.appear());
        this.vars.elements.push({
            element: rect,
            x,
            y,
            width,
            height,
        });
        this.childAs(rect, rectRule);
        return rect;
    },
    rectX: elementProp1("x"),
    rectY: elementProp1("y"),
    rectWidth: elementProp1("width"),
    rectHeight: elementProp1("height"),
    drawCircle(x, y, r) {
        const circle = new CircleSVG(this).opacity(0).onEnter(EN.appear());
        if (r !== undefined) circle.r(r);
        this.vars.elements.push({
            element: circle,
            x,
            y,
        });
        this.childAs(circle, circleRule);
        return circle;
    },
    circleX: elementProp1("x"),
    circleY: elementProp1("y"),
    drawFunction(func) {
        const path = new Path(this).opacity(0).onEnter(EN.pointStoT());
        this.vars.elements.push({
            element: path,
            func,
            sampleCount: 20,
        });
        this.childAs(path, functionRule);
        return path;
    },
    function: elementProp1("func"),
    functionSampleCount: elementProp1("sampleCount"),

    drawLine(x, y, dx, dy) {
        if (arguments.length === 2) {
            const [v, d] = arguments;
            return this.drawLine(v[0], v[1], d[0], d[1]);
        } else if (arguments.length === 3) {
            if (Array.isArray(arguments[0])) {
                const [v, dx, dy] = arguments;
                return this.drawLine(v[0], v[1], dx, dy);
            } else {
                const [x, y, d] = arguments;
                return this.drawLine(x, y, d[0], d[1]);
            }
        }
        const path = new Path(this).opacity(0).onEnter(EN.pointStoT());
        this.vars.elements.push({
            element: path,
            position: [x, y],
            direction: [dx, dy],
            sampleCount: 2,
        });
        this.childAs(path, lineRule);
        return path;
    },
    lineDirection: elementProp2("direction"),
    linePosition: elementProp2("position"),
    lineSampleCount: elementProp1("sampleCount"),

    drawRay(x, y, dx, dy) {
        if (arguments.length === 2) {
            const [v, d] = arguments;
            return this.drawRay(v[0], v[1], d[0], d[1]);
        } else if (arguments.length === 3) {
            if (Array.isArray(arguments[0])) {
                const [v, dx, dy] = arguments;
                return this.drawRay(v[0], v[1], dx, dy);
            } else {
                const [x, y, d] = arguments;
                return this.drawRay(x, y, d[0], d[1]);
            }
        }
        const ray = new Path(this).opacity(0).onEnter(EN.pointStoT());
        this.vars.elements.push({
            element: ray,
            position: [x, y],
            direction: [dx, dy],
            sampleCount: 2,
        });
        this.childAs(ray, rayRule);
        return ray;
    },
    rayDirection: elementProp2("direction"),
    rayPosition: elementProp2("position"),
    raySampleCount: elementProp1("sampleCount"),

    __getElement(element) {
        for (const _element of this.vars.elements) if (_element.element === element) return _element;
        return undefined;
    },
});

function valid(v) {
    return Check.isNumber(v[0]) && Check.isNumber(v[1]);
}

function circleRule(parent, child) {
    const element = parent.__getElement(child);
    const circle = element.element;
    circle.center(parent.global(element.x, element.y));
}

function rectRule(parent, child) {
    const element = parent.__getElement(child);
    const rect = element.element;
    const [minX, maxY] = parent.global(element.x, element.y);
    const [maxX, minY] = parent.global(element.x + element.width, element.y + element.height);
    parent.tryUpdate(rect, () => {
        rect.width(maxX - minX).x(minX);
        rect.height(maxY - minY).y(minY);
    });
}

function functionRule(parent, child) {
    const element = parent.__getElement(child);
    const path = element.element;
    const func = element.func;
    const sampleCount = element.sampleCount;
    const pen = sampleBy(parent, sampleCount, func, "x");
    parent.tryUpdate(path, () => {
        path.d(pen.toString());
    });
}

function lineRule(parent, child) {
    const element = parent.__getElement(child);
    const line = element.element;
    const p = element.position;
    const d = element.direction;
    const sampleCount = element.sampleCount;
    let pen;
    if (!dqual(d[0], 0)) {
        const func = x => (d[1] / d[0]) * x + (p[1] - (p[0] * d[1]) / d[0]);
        pen = sampleBy(parent, sampleCount, func, "x");
    } else {
        const func = y => (d[0] / d[1]) * y + (p[0] - (p[1] * d[0]) / d[1]);
        pen = sampleBy(parent, sampleCount, func, "y");
    }
    parent.tryUpdate(line, () => {
        line.d(pen.toString());
    });
}

function rayRule(parent, child) {
    const element = parent.__getElement(child);
    const ray = element.element;
    const p = element.position;
    const d = element.direction;
    const sampleCount = element.sampleCount;
    const x = parent.axis("x").inversePercent(0);
    const mx = parent.axis("x").inversePercent(1);
    const y = parent.axis("y").inversePercent(0);
    const my = parent.axis("y").inversePercent(1);
    const intersect = V.intersectRayWithBox(p, d, x, y, mx - x, my - y);
    let pen;
    if (intersect === undefined) pen = new PathPen();
    else if (intersect.length === 1) {
        if (!dqual(d[0], 0)) {
            const func = x => (d[1] / d[0]) * x + (p[1] - (p[0] * d[1]) / d[0]);
            const at = parent.axis("x").percent(p[0]);
            if (d[0] > 0) pen = sampleBy(parent, sampleCount, func, "x", [at, 1]);
            else pen = sampleBy(parent, sampleCount, func, "x", [at, 0]);
        } else {
            const func = y => (d[0] / d[1]) * y + (p[0] - (p[1] * d[0]) / d[1]);
            const at = parent.axis("x").percent(p[1]);
            if (d[1] > 0) pen = sampleBy(parent, sampleCount, func, "y", [at, 1]);
            else pen = sampleBy(parent, sampleCount, func, "y", [at, 0]);
        }
    } else {
        if (!dqual(d[0], 0)) {
            const func = x => (d[1] / d[0]) * x + (p[1] - (p[0] * d[1]) / d[0]);
            if (d[0] > 0) pen = sampleBy(parent, sampleCount, func, "x");
            else pen = sampleBy(parent, sampleCount, func, "x", [1, 0]);
        } else {
            const func = y => (d[0] / d[1]) * y + (p[0] - (p[1] * d[0]) / d[1]);
            if (d[1] > 0) pen = sampleBy(parent, sampleCount, func, "y");
            else pen = sampleBy(parent, sampleCount, func, "y", [1, 0]);
        }
    }
    parent.tryUpdate(ray, () => {
        ray.d(pen.toString());
    });
}

function sampleBy(parent, sampleCount, func, by, range = undefined) {
    let firstMoveTo = false;
    const pen = new PathPen();
    function sample(i) {
        if (range === undefined) return i / (sampleCount - 1);
        const [l, r] = range;
        return (i / (sampleCount - 1)) * (r - l) + l;
    }
    for (let i = 0; i < sampleCount; i++) {
        let x;
        let y;
        let prevX;
        let prevY;
        if (by === "x") {
            x = parent.axis("x").inversePercent(sample(i));
            y = func(x);
            prevX = parent.axis("x").inversePercent(sample(i - 1));
            prevY = func(prevX);
        } else {
            y = parent.axis("y").inversePercent(sample(i));
            x = func(y);
            prevY = parent.axis("y").inversePercent(sample(i - 1));
            prevX = func(prevY);
        }
        const point = parent.global(x, y);
        const prevPoint = parent.global(prevX, prevY);
        if (i > 0) {
            if (valid([x, y]) && valid([prevX, prevY])) {
                const intersect = V.cohenSutherland(prevPoint, point, parent.x(), parent.y(), parent.width(), parent.height());
                if (!intersect) {
                    firstMoveTo = false;
                    continue;
                }
                const [source, target] = intersect;
                if (!firstMoveTo) {
                    pen.MoveTo(source);
                    firstMoveTo = true;
                }
                pen.LinkTo(target);
            } else if (valid([x, y])) {
                if (by === "x") {
                    if (Math.abs(parent.my() - point[1]) < parent.height() / 2) {
                        const source = [prevPoint[0], parent.my()];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LinkTo(target);
                    } else {
                        const source = [prevPoint[0], parent.y()];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LinkTo(target);
                    }
                } else {
                    if (Math.abs(parent.mx() - point[0]) < parent.width() / 2) {
                        const source = [parent.mx(), prevPoint[1]];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LinkTo(target);
                    } else {
                        const source = [parent.x(), prevPoint[0]];
                        const target = point;
                        if (!firstMoveTo) {
                            pen.MoveTo(source);
                            firstMoveTo = true;
                        }
                        pen.LinkTo(target);
                    }
                }
            }
        } else if (i === 0) {
            if (valid([x, y])) {
                if (parent.x() > point[0] || point[0] > parent.mx() || parent.y() > point[1] || point[1] > parent.my()) {
                    firstMoveTo = false;
                    continue;
                }
                if (!firstMoveTo) {
                    pen.MoveTo(point);
                    firstMoveTo = true;
                }
            }
        }
    }
    return pen;
}
