import * as sd from "@/sd";

export class IntervalSubtree extends sd.SD2DNode {
    constructor(target) {
        super(target);
        this.vars.merge({
            x: 0,
            y: 0,
            width: 300,
            height: 150,
        });
        const subtree = new sd.Box(this);
        const interval = new sd.Rect(this);
        this.childAs("interval", interval, (parent, child) => {
            child.x(parent.x());
            child.width(parent.width());
            child.height(5);
        });
        this.childAs("subtree", subtree, (parent, child) => {
            child.x(parent.x());
            child.y(parent.y() + 5);
            child.width(parent.width());
            child.height(parent.height() - 5);
        });
    }
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.lpset("x", x);
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.lpset("y", y);
        return this;
    }
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        this.vars.lpset("width", width);
        return this;
    }
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        this.vars.lpset("height", height);
        return this;
    }
}
