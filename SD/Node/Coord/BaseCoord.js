import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { SD2DNode } from "../SD2DNode";

export function BaseCoord(parent) {
    SD2DNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        elements: [],
    });
}

function handler(key) {
    return function (by, value) {
        if (arguments.length === 1) return this.axis(by)[key];
        this.axis(by)[key](value);
        return this;
    };
}

BaseCoord.prototype = {
    ...SD2DNode.prototype,
    BASE_COORD: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    axis() {
        ErrorLauncher.notImplementedYet("axis", this.type());
    },
    ticks: handler("ticks"),
    withTick: handler("withTick"),
    withTickLabel: handler("withTickLabel"),
    local() {
        ErrorLauncher.notImplementedYet("local", this.type());
    },
    localX(x, y) {
        if (arguments.length === 2) return this.local(x, y)[0];
        if (Array.isArray(x)) return this.localX(x[0], x[1]);
        return this.localX(x, 0);
    },
    localY(x, y) {
        if (arguments.length === 2) return this.local(x, y)[1];
        if (Array.isArray(x)) return this.localY(x[0], x[1]);
        return this.localY(0, x);
    },
    global() {
        ErrorLauncher.notImplementedYet("global", this.type());
    },
    globalX(x, y) {
        if (arguments.length === 2) return this.global(x, y)[0];
        if (Array.isArray(x)) return this.globalX(x[0], x[1]);
        return this.globalX(x, 0);
    },
    globalY(x, y) {
        if (arguments.length === 2) return this.global(x, y)[1];
        if (Array.isArray(x)) return this.globalY(x[0], x[1]);
        return this.globalY(0, x);
    },
};
