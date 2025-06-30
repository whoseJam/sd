import { Vector as V } from "@/Math/Vector";
import { SD2DNode } from "@/Node/SD2DNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export class BaseAxis extends SD2DNode {
    constructor(target) {
        super(target);

        this.vars.merge({
            ticks: 10,
        });
    }
    static log2(start, end) {
        return {
            scale: "log2",
            start,
            end,
        };
    }
    static log10(start, end) {
        return {
            scale: "log10",
            start,
            end,
        };
    }
}

Object.assign(BaseAxis.prototype, {
    ticks: Factory.handler("ticks"),
    tick() {
        ErrorLauncher.notImplementedYet("tick", this.type());
    },
    percent(x) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            return x / ticks;
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            return (x - start) / (end - start);
        } else if (ticks.scale) {
            const [start, end] = [ticks.start, ticks.end];
            if (ticks.scale === "log2") return Math.log2(x - start + 1) / Math.log2(end - start + 1);
            if (ticks.scale === "log10") return Math.log10(x - start + 1) / Math.log10(end - start + 1);
        }
    },
    inversePercent(x) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            return x * ticks;
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            return x * (end - start) + start;
        } else if (ticks.scale) {
            const [start, end] = [ticks.start, ticks.end];
            if (ticks.scale === "log2") return (Math.pow(2, x) - 1) * (end - start) + start;
        }
    },
    local(x, y) {
        if (arguments.length === 1) return this.local(x[0], x[1]);
        const direction = V.sub([x, y], this.source());
        const length = V.dotMul(direction, this.direction()) / V.length(this.direction());
        const k = length / this.length();
        return this.inversePercent(k);
    },
    global(x) {
        return this.child("line").at(this.percent(x));
    },
    globalX(x) {
        return this.global(x)[0];
    },
    globalY(x) {
        return this.global(x)[1];
    },
    forEachTick(callback) {
        const ticks = this.ticks();
        if (typeof ticks === "number") {
            for (let i = 0; i <= ticks; i++) {
                callback(this.tick(i), i);
            }
        } else if (Array.isArray(ticks) && ticks.length === 3) {
            const [start, end, step] = ticks;
            for (let i = start; i <= end; i += step) {
                callback(this.tick(i), i);
            }
        } else if (ticks.scale) {
            const [start, end] = [ticks.start, ticks.end];
            if (ticks.scale === "log2") for (let i = start, k = 1; i <= end; i += k, k *= 2) callback(this.tick(i), i);
            if (ticks.scale === "log10") for (let i = start, k = 1; i <= end; i *= k, k *= 10) callback(this.tick(i), i);
        }
    },
    tickCount() {
        let count = 0;
        this.forEachTick(() => count++);
        return count;
    },
});
