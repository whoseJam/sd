import { Action } from "@/Animate/Action";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

function interp(l, r, snap) {
    return function (t) {
        if (t !== 0) return;
        if (l === r) snap.attr({ points: this.target });
        else snap.animate({ points: this.target }, r - l, mina.easeinout);
    };
}

function polygenInterp(node, attr) {
    return function (newValue, oldValue) {
        const l = node.delay();
        const r = node.delay() + node.duration();
        const snap = Snap(attr.nake());
        new Action(l, r, oldValue, newValue, interp(l, r, snap), node, "points");
    };
}

function pointsToBox(points) {
    let x = Infinity;
    let mx = -Infinity;
    let y = Infinity;
    let my = -Infinity;
    points.forEach(point => {
        x = Math.min(x, point[0]);
        mx = Math.max(mx, point[0]);
        y = Math.min(y, point[1]);
        my = Math.max(my, point[1]);
    });
    if (x === Infinity || y === Infinity) return { x: 0, y: 0, width: 0, height: 0 };
    return { x: x, y: y, width: mx - x, height: my - y };
}

export function Polygon(parent, points = []) {
    BaseSVG.call(this, parent, "polygon");

    this.type("Polygen");

    this.vars.fill = C.white;
    this.vars.stroke = C.black;
    this.vars.merge({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        points: points,
    });

    this.vars.associate("points", polygenInterp(this, this._.nake));
    this.effect("box", () => {
        const box = pointsToBox(this.vars.points);
        this.vars.x = box.x;
        this.vars.y = box.y;
        this.vars.width = box.width;
        this.vars.height = box.height;
    });

    this._.nake.setAttribute("points", this.vars.points);
}

Polygon.prototype = {
    ...BaseSVG.prototype,
    points: Factory.handler("points"),
    x(x) {
        if (x === undefined) return this.vars.x;
        this.points(updatePoints(this.vars, x - this.vars.x, 0));
        return this;
    },
    y(y) {
        if (y === undefined) return this.vars.y;
        this.points(updatePoints(this.vars, 0, y - this.vars.y));
        return this;
    },
    width(width) {
        if (width === undefined) return this.vars.width;
        this.points(updatePointsWidth(this.vars, width));
        return this;
    },
    height(height) {
        if (height === undefined) return this.vars.height;
        this.points(updatePointsHeight(this.vars, height));
        return this;
    },
};

function updatePoints(vars, dx, dy) {
    const points = vars.points;
    points.forEach(point => {
        point[0] += dx;
        point[1] += dy;
    });
    return points;
}

function updatePointsWidth(vars, width) {
    const points = vars.points;
    const x = vars.x;
    const oldWidth = vars.width;
    points.forEach(point => {
        point[0] = ((point[0] - x) / oldWidth) * width + x;
    });
    return points;
}

function updatePointsHeight(vars, height) {
    const points = vars.points;
    const y = vars.y;
    const oldHeight = vars.height;
    points.forEach(point => {
        point[1] = ((point[1] - y) / oldHeight) * height + y;
    });
    return points;
}
