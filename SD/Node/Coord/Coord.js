import { Context } from "@/Animate/Context";
import { Vector as V } from "@/Math/Vector";
import { Line } from "@/Node/Nake/Line";
import { Path } from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";
import { Factory } from "@/Utility/Factory";
import { PathPen } from "@/Utility/PathPen";
import { Enter as EN } from "@/Node/Core/Enter";

export function Coord(parent) {
    SDNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        viewBox: {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        },
    });

    this.childAs("x-axis", new Line(this).arrow().source(0, 0).target(40, 0), function(parent, child) {
        const Y = parent.vars.viewBox.y;
        const H = parent.vars.viewBox.height;
        const currentY = Math.min(Y + H, Math.max(Y, 0));
        child.cy(parent.globalY(currentY));
        child.x(parent.globalX(parent.vars.viewBox.x));
        child.width(parent.width());
    });
    this.childAs("y-axis", new Line(this).arrow().source(0, 40).target(0, 0), function(parent, child) {
        const X = parent.vars.viewBox.x;
        const W = parent.vars.viewBox.width;
        const currentX = Math.min(X + W, Math.max(X, 0));
        child.cx(parent.globalX(currentX));
        child.y(parent.globalY(parent.vars.viewBox.y + parent.vars.viewBox.height));
        child.height(parent.height());
    });

    this._.BASE_COORD = true;
}

Coord.SAMPLE_COUNT = 50;

function viewBoxHandler(key) {
    return function (value) {
        if (value === undefined) return this.vars.viewBox[key];
        this.vars.viewBox[key] = value;
        return this;
    };
}

Coord.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    viewBox(x, y, width, height) {
        if (x === undefined) return { x: this.vars.x, y: this.vars.y, width: this.vars.height, height: this.vars.height };
        if (arguments.length === 1) return this.viewBox(x.x, x.y, x.width, x.height);
        this.vars.viewBox = { x, y, width, height };
        return this;
    },
    viewX: viewBoxHandler("x"),
    viewY: viewBoxHandler("y"),
    viewWidth: viewBoxHandler("width"),
    viewHeight: viewBoxHandler("height"),
    coordX(x) {
        return ((x - this.x()) / this.width()) * this.viewWidth() + this.viewX();
    },
    coordY(y) {
        return ((this.my() - y) / this.height()) * this.viewHeight() + this.viewY();
    },
    coordAt(x, y) {
        if (arguments.length === 1) return this.coordAt(x[0], x[1]);
        return [this.coordX(x), this.coordY(y)];
    },
    globalX(x) {
        return ((x - this.viewX()) / this.viewWidth()) * this.width() + this.x();
    },
    globalY(y) {
        return this.my() - ((y - this.viewY()) / this.viewHeight()) * this.height();
    },
    globalAt(x, y) {
        if (arguments.length === 1) return this.globalAt(x[0], x[1]);
        return [this.globalX(x), this.globalY(y)];
    },
    sampleX(x, count) {
        return (this.viewWidth() / count) * x + this.viewX();
    },
    sampleY(y, count) {
        return (this.viewHeight() / count) * y + this.viewY();
    },
    trim(source, target) {
        if (typeof target === "number") return V.intersect(source, target);
        return V.cohenSutherland(source, target, this.x(), this.y(), this.width(), this.height());
    },
    xAxis() {
        return this.child("x-axis");
    },
    yAxis() {
        return this.child("y-axis");
    },
    draw,
};

function draw() {
    const args = [...arguments];
    const name = args.filter(arg => typeof arg === "string")[0];
    const callback = args.filter(arg => typeof arg === "function")[0];
    const parent = this;
    const path = new Path(this);
    path.vars.merge({
        function: callback,
    });
    path.function = Factory.handler("function");
    path.coordX = function (y) {
        return this.function()(y);
    };
    path.coordY = function (x) {
        return this.function()(x);
    };
    path.trimCoordX = function (y) {
        return Math.min(Math.max(this.coordX(y), parent.viewX(), parent.viewX() + parent.viewWidth()));
    };
    path.trimCoordY = function (x) {
        return Math.min(Math.max(this.coordY(x), parent.viewY(), parent.viewY() + parent.viewHeight()));
    };
    path.globalY = function (x) {
        return parent.globalY(this.coordY(x));
    };
    path.globalX = function (y) {
        return parent.globalX(this.coordX(y));
    };
    path.trimGlobalY = function (x) {
        return Math.min(Math.max(this.globalY(x), parent.y()), parent.my());
    };
    path.trimGlobalX = function (y) {
        return Math.min(Math.max(this.globalX(y), parent.x()), parent.mx());
    };
    path.onEnter(EN.pointStoT());
    if (name) this.childAs(name, path, pathRule);
    else this.childAs(path, pathRule);
    return path;
}

Coord.prototype.drawLine = function (name, k, x, y) {
    throw new Error("Not Implemented Yet");
    if (arguments.length === 3) return this.drawLine(name, k, x[0], x[1]);
    const line = new Line(this).opacity(0);
    for (let key in COORD_LOCATION_KEYS) line.member.new(COORD_LOCATION_KEYS[key]);

    line.startAnimate(this);
    line.member.new("k", k);
    line.member.new("point", [x, y]);

    line.k = SDNode.ordinaryGetterAndSetter("k", "setByDqual");
    line.point = SDNode.ordinaryGetterAndSetter("point", "set");

    this.childAs(name, line, LineRule);

    return line;
};


function pathRule(parent, path) {
    const callback = path.function();
    const pen = new PathPen();
    let firstMoveTo = false;
    for (let i = 0; i <= Coord.SAMPLE_COUNT; i++) {
        const x = parent.sampleX(i, Coord.SAMPLE_COUNT);
        const y = callback(x);
        const lastX = parent.sampleX(i - 1, Coord.SAMPLE_COUNT);
        const lastY = callback(lastX);
        const point = parent.globalAt(x, y);
        const lastPoint = parent.globalAt(lastX, lastY);
        const [source, target, accpeted] = parent.trim(lastPoint, point);
        if (!accpeted) {
            firstMoveTo = false;
            continue;
        }
        if (!firstMoveTo) {
            pen.MoveTo(source);
            firstMoveTo = true;
        }
        pen.LinkTo(target);
    }
    path.d(pen.toString());
}

function lineRule(parent, child) {
    // if (valueChanged) {
    //     const point = child.member.get("point");
    //     const k = child.member.get("k");
    // }
}
