import * as sd from "@/sd";

const EN = sd.enter();

function convertToWorld1(worldBox, viewBox, point) {
    const x = ((point[0] - viewBox.x) / (viewBox.width - 1)) * worldBox.width + worldBox.x;
    const y = worldBox.y + worldBox.height - ((point[1] - viewBox.y) / (viewBox.height - 1)) * worldBox.height;
    return [x, y];
}

function convertToWorld2(worldBox, viewBox, point) {
    const x = ((point[0] - viewBox.x + 0.5) / viewBox.width) * worldBox.width + worldBox.x;
    const y = worldBox.y + worldBox.height - ((point[1] - viewBox.y + 0.5) / viewBox.height) * worldBox.height;
    return [x, y];
}

class Axis extends sd.SD2DNode {
    constructor(parent) {
        super(parent);
        this.type("Axis");
        this.vars.merge({
            direction: "horizontal",
            x: 0,
            y: 0,
            count: 10,
            length: 100,
        });
        const ticks = [];
        const allocateTick = () => {
            for (let i = 0; i < ticks.length; i++) {
                const tick = ticks[i];
                if (tick.status === "in_use") continue;
                if (tick.status === "pre_used") return tick.onEnter(EN.moveTo());
                return tick.onEnter(EN.appear());
            }
            const tick = new sd.Line(this).onEnter(EN.appear());
            tick.status = "not_used";
            ticks.push(tick);
            this.childAs(tick);
            return tick;
        };
        this.childAs("line", new sd.Line(this), (parent, child) => {
            const length = parent.vars.length;
            if (parent.direction() === "horizontal") {
                const [x, y] = parent.pos("x", "y");
                child.source(x, y).target(x + length, y);
            } else {
                const [x, y] = parent.pos("x", "y");
                child.source(x, y).target(x, y - length);
            }

            const k = 1 / (parent.vars.count - 1);
            ticks.forEach(tick => {
                if (tick.status === "in_use") {
                    tick.status = "pre_used";
                }
            });
            for (let i = 0; i < parent.vars.count; i++) {
                const at = child.at(i * k);
                const tick = allocateTick();
                if (parent.direction() === "horizontal") {
                    const [x, y] = tick.pos("x", "y");
                    parent.tryUpdate(tick, () => {
                        tick.source(x, y).target(x, y - 5);
                        tick.center(at);
                    });
                } else {
                    const [x, y] = child.pos("x", "y");
                    parent.tryUpdate(tick, () => {
                        tick.source(x, y).target(x + 5, y);
                        tick.center(at);
                    });
                }
                tick.status = "in_use";
            }
            ticks.forEach(tick => {
                if (tick.status === "pre_used") {
                    tick.status = "not_used";
                    tick.opacity(0);
                }
            });
        });
    }
    direction(direction) {
        if (arguments.length === 0) return this.vars.direction;
        this.vars.direction = direction;
        return this;
    }
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.x = x;
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.y = y;
        return this;
    }
    length(length) {
        if (arguments.length === 0) return this.vars.length;
        this.vars.length = length;
        return this;
    }
    tickCount(count) {
        if (arguments.length === 0) return this.vars.count;
        this.vars.count = count;
        return this;
    }
}

export class Space extends sd.SD2DNode {
    constructor(parent) {
        super(parent);
        this.type("Space");
        this.vars.merge({
            x: 0,
            y: 0,
            width: 400,
            height: 400,
            identityWidth: 40,
            identityHeight: 40,
            viewBox: {
                x: 0,
                y: 0,
                width: 10,
                height: 10,
            },
            elements: [],
            tickType: "atPoint",
        });
        this.effect("layoutElement", () => {
            const convert = this.vars.tickType === "atPoint" ? convertToWorld1 : convertToWorld2;
            this.vars.elements.forEach(element => {
                if (element.rect) {
                    const mn = convert(this.worldBox(), this.viewBox(), [element.x, element.y]);
                    const mx = convert(this.worldBox(), this.viewBox(), [element.x + element.width, element.y + element.height]);
                    const rect = element.rect;
                    rect.width(mx[0] - mn[0]);
                    rect.height(mn[1] - mx[1]);
                    rect.x(mn[0]).my(mn[1]);
                } else if (element.point) {
                    const pos = convert(this.worldBox(), this.viewBox(), [element.x, element.y]);
                    const point = element.point;
                    point.center(pos);
                }
            });
        });
        this.childAs(new Axis(this).direction("horizontal"), (parent, child) => {
            child.x(parent.x()).y(parent.my()).length(parent.width());
            child.tickCount(parent.tickType() === "atPoint" ? parent.vars.viewBox.width : parent.vars.viewBox.width + 1);
        });
        this.childAs(new Axis(this).direction("vertical"), (parent, child) => {
            child.x(parent.x()).y(parent.my()).length(parent.height());
            child.tickCount(parent.tickType() === "atPoint" ? parent.vars.viewBox.height : parent.vars.viewBox.height + 1);
        });
    }
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.x = x;
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.y = y;
        return this;
    }
    globalX(x) {
        if (this.tickType() === "atPoint") return convertToWorld1(this.worldBox(), this.viewBox(), [x, 0])[0];
        return convertToWorld2(this.worldBox(), this.viewBox(), [x, 0])[0];
    }
    globalY(y) {
        if (this.tickType() === "atPoint") return convertToWorld1(this.worldBox(), this.viewBox(), [0, y])[1];
        return convertToWorld2(this.worldBox(), this.viewBox(), [0, y])[1];
    }
    width(width) {
        if (arguments.length === 0) {
            if (this.tickType() === "atPoint") return this.identityWidth() * (this.vars.viewBox.width - 1);
            return this.identityWidth() * this.vars.viewBox.width;
        }
        this.identityWidth(width / this.vars.viewBox.width);
        return this;
    }
    height(height) {
        if (arguments.length === 0) {
            if (this.tickType() === "atPoint") return this.identityHeight() * (this.vars.viewBox.height - 1);
            return this.identityHeight() * this.vars.viewBox.height;
        }
        this.identityHeight(height / this.vars.viewBox.height);
        return this;
    }
    identityWidth(width) {
        if (arguments.length === 0) return this.vars.identityWidth;
        this.vars.identityWidth = width;
        return this;
    }
    identityHeight(height) {
        if (arguments.length === 0) return this.vars.identityHeight;
        this.vars.identityHeight = height;
        return this;
    }
    worldBox() {
        return {
            x: this.vars.x,
            y: this.vars.y,
            width: this.width(),
            height: this.height(),
        };
    }
    viewBox(box) {
        if (arguments.length === 0) return this.vars.viewBox;
        this.vars.viewBox = box;
        return this;
    }
    tickType(type) {
        if (arguments.length === 0) return this.vars.tickType;
        this.vars.tickType = type;
        return this;
    }
    addRect(x, y, width, height) {
        const rect = new sd.Rect(this).fillOpacity(0);
        this.vars.elements.push({
            rect,
            x,
            y,
            width,
            height,
        });
        this.childAs(rect);
        return rect;
    }
    addPoint(x, y) {
        const point = new sd.Circle(this).fillOpacity(0);
        this.vars.elements.push({
            point,
            x,
            y,
        });
        this.childAs(point);
        return point;
    }
}
