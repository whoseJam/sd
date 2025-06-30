import { dqual } from "@/Math/Math";
import { Vector as V } from "@/Math/Vector";
import { BaseAxis } from "@/Node/Axis/BaseAxis";
import { Enter as EN } from "@/Node/Core/Enter";
import { Line } from "@/Node/Path/Line";
import { Text } from "@/Node/Text/Text";
import { Factory } from "@/Utility/Factory";
import { ObjectPool } from "@/Utility/Pool/ObjectPool";

function createTickPool(axis) {
    return new ObjectPool({
        onIdle(tick) {
            tick.opacity(0);
        },
        getIdle(tick) {
            return tick.onEnter(EN.appear());
        },
        getUsed(tick) {
            return tick.onEnter(EN.moveTo());
        },
        onCreate() {
            const tick = new Line(axis);
            axis.childAs(tick);
            return tick;
        },
    });
}

function createTickLabelPool(axis) {
    return new ObjectPool({
        onIdle(text) {
            text.opacity(0);
        },
        getIdle(text) {
            return text.onEnter(EN.appear());
        },
        getUsed(text) {
            return text.onEnter(EN.moveTo());
        },
        onCreate(i) {
            const text = new Text(axis, i);
            axis.childAs(text);
            return text;
        },
    });
}

export class Axis extends BaseAxis {
    constructor(target, vars = {}) {
        super(target);

        this.type("Axis");

        this.vars.merge({
            direction: [1, 0],
            sx: 0,
            sy: 0,
            length: 300,
            ticks: 10,
            withTick: true,
            withTickLabel: false,
            tickLength: 5,
            tickAlign: "center",
            fontSize: 20,
            tickLabelAlign: "source",
            tickLabelFormat: i => i,
            ...vars,
        });

        const tickPool = createTickPool(this);
        const tickLabelPool = createTickLabelPool(this);
        this._.tickPool = tickPool;
        this._.tickLabelPool = tickLabelPool;

        this.childAs("line", new Line(this), (parent, child) => {
            const length = parent.length();
            const direction = V.norm(parent.direction());
            const [x, y] = [parent.sx(), parent.sy()];
            child.source(x, y).target(V.add([x, y], V.numberMul(direction, length)));
        });
        this.effect("tick", () => {
            const direction = V.norm(this.direction());
            const rotate = V.complexMul(direction, V.makeComplex(1, -Math.PI / 2));
            const tickAlign = this.tickAlign();
            const tickLength = this.tickLength();
            tickPool.beforeAllocate();
            if (this.withTick()) {
                this.forEachTick((_, i) => {
                    const at = this.global(i);
                    const tick = tickPool.allocate(i);
                    const [x, y] = tick.pos("x", "y");
                    this.tryUpdate(tick, () => {
                        tick.source(x, y).target(V.add([x, y], V.numberMul(rotate, tickLength)));
                        if (tickAlign === "center") tick.center(at);
                        else if (tickAlign === "source") tick.dx(at[0] - tick.x1()).dy(at[1] - tick.y1());
                        else tick.dx(at[0] - tick.x2()).dy(at[1] - tick.y2());
                    });
                });
            }
            tickPool.afterAllocate();
        });
        this.effect("tickLabel", () => {
            const direction = V.norm(this.direction());
            const rotate = V.complexMul(direction, V.makeComplex(1, -Math.PI / 2));
            const tickAlign = this.tickAlign();
            const tickLength = this.withTick() ? this.tickLength() : 0;
            const tickLabelAlign = this.tickLabelAlign();
            const tickLabelFormat = this.tickLabelFormat();
            const fontSize = this.fontSize();
            tickLabelPool.beforeAllocate();
            if (this.withTickLabel()) {
                this.forEachTick((_, i) => {
                    const at = this.global(i);
                    const tickLabel = tickLabelPool.allocate(tickLabelFormat(i));
                    this.tryUpdate(tickLabel, () => {
                        tickLabel.fontSize(fontSize);
                        if (tickLabelAlign === "source") {
                            if (tickAlign === "source") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, -10)));
                            } else if (tickAlign === "center") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, -10 - tickLength / 2)));
                            } else {
                                tickLabel.center(V.add(at, V.numberMul(rotate, -10 - tickLength)));
                            }
                        } else {
                            if (tickAlign === "source") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, 10 + tickLength)));
                            } else if (tickAlign === "center") {
                                tickLabel.center(V.add(at, V.numberMul(rotate, 10 + tickLength / 2)));
                            } else {
                                tickLabel.center(V.add(at, V.numberMul(rotate, 10)));
                            }
                        }
                    });
                });
            }
            tickLabelPool.afterAllocate();
        });
    }
}

Object.assign(Axis.prototype, {
    tick(i) {
        if (this._.tickPool.isUsing(i)) return this._.tickPool.get(i);
        return undefined;
    },
    x(x) {
        const t = Math.min(this.sx(), this.tx());
        if (arguments.length === 0) return t;
        return this.dx(x - t);
    },
    y(y) {
        const t = Math.min(this.sy(), this.ty());
        if (arguments.length === 0) return t;
        return this.dy(y - t);
    },
    dx(dx) {
        return this.sx(this.sx() + dx);
    },
    dy(dy) {
        return this.sy(this.sy() + dy);
    },
    sx: Factory.handlerLowPrecise("sx"),
    sy: Factory.handlerLowPrecise("sy"),
    tx(tx) {
        const x = this.target()[0];
        if (arguments.length === 0) return x;
        return this.dx(tx - x);
    },
    ty(ty) {
        const y = this.target()[1];
        if (arguments.length === 0) return y;
        return this.dy(ty - y);
    },
    source(x, y) {
        if (arguments.length === 0) return [this.sx(), this.sy()];
        if (arguments.length === 1) return this.source(x[0], x[1]);
        this.freeze();
        this.sx(x).sy(y);
        this.unfreeze();
        return this;
    },
    target(x, y) {
        if (arguments.length === 0) {
            const source = this.source();
            return V.add(source, V.numberMul(V.norm(this.direction()), this.length()));
        } else if (arguments.length === 1) return this.target(x[0], x[1]);
        this.freeze();
        this.tx(x).ty(y);
        this.unfreeze();
        return this;
    },
    width(width) {
        const direction = this.direction();
        if (arguments.length === 0) return this.length() * Math.abs(V.cos(direction));
        if (dqual(direction[0], 0)) return this;
        return this.length(width / Math.abs(V.cos(direction)));
    },
    height(height) {
        const direction = this.direction();
        if (arguments.length === 0) return this.length() * Math.abs(V.sin(direction));
        if (dqual(direction[1], 0)) return this;
        return this.length(height / Math.abs(V.sin(direction)));
    },
    length: Factory.handlerLowPrecise("length"),
    direction(direction) {
        if (arguments.length === 0) return this.vars.direction;
        if (arguments.length === 2) return this.direction(arguments);
        if (typeof direction === "string") {
            if (direction === "horizontal") return this.direction([0, 1]);
            return this.direction([0, -1]);
        }
        this.vars.direction = direction;
        return this;
    },
    withTick: Factory.handler("withTick"),
    withTickLabel: Factory.handler("withTickLabel"),
    tickLength: Factory.handlerLowPrecise("tickLength"),
    tickAlign: Factory.handler("tickAlign"),
    fontSize: Factory.handler("fontSize"),
    tickLabelAlign: Factory.handler("tickLabelAlign"),
    tickLabelFormat: Factory.handler("tickLabelFormat"),
});
