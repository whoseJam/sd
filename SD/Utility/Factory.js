import { Action } from "@/Animate/Action";
import { setPrecise } from "@/Node/Core/Reactive";

function lowPrecise(oldValue, newValue) {
    return Math.abs(oldValue - newValue) >= 1;
}

function mediumPrecise(oldValue, newValue) {
    return Math.abs(oldValue - newValue) >= 1e-1;
}

function highPrecise(oldValue, newValue) {
    return Math.abs(oldValue - newValue) >= 1e-2;
}

export class Factory {
    static handler(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            this.vars[key] = value;
            return this;
        };
    }

    static handlerLowPrecise(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            setPrecise(this.vars, key, lowPrecise);
            this.vars[key] = value;
            return this;
        };
    }

    static handlerMediumPrecise(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            setPrecise(this.vars, key, mediumPrecise);
            this.vars[key] = value;
            return this;
        };
    }

    static handlerHighPrecise(key) {
        return function (value) {
            if (value === undefined) return this.vars[key];
            setPrecise(this.vars, key, highPrecise);
            this.vars[key] = value;
            return this;
        };
    }

    static action(node, attrs, key, interp) {
        return function (newValue, oldValue) {
            if (global.ACTION_TICK !== 0) {
                attrs.setAttribute(key, newValue);
            } else {
                new Action(node.delay(), node.delay() + node.duration(), oldValue, newValue, interp(attrs, key), node, key);
            }
        };
    }
}
