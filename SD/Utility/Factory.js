import { Action } from "@/Animate/Action";
import { setPrecise } from "@/Node/Core/Reactive";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

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
    static action(node, _object, key, interp) {
        let object = () => _object;
        if (typeof _object === "string") object = () => node._[_object];
        else if (typeof _object === "function") object = _object;
        return function (newValue, oldValue) {
            // console.log("key=", key, "new=", newValue, "old=", oldValue);
            if (global.ACTION_TICK !== 0) {
                const obj = object();
                if (obj.setAttribute) obj.setAttribute(key, newValue);
                else if (obj[key]) obj[key] = newValue;
                else ErrorLauncher.whatHappened();
            } else {
                new Action(node.delay(), node.delay() + node.duration(), oldValue, newValue, interp(object(), key), node, key);
            }
        };
    }
    static actionForCamera(node, object, key, interp) {
        const i1 = interp(object, key);
        const i2 = function (object, key) {
            return function (t) {
                i1.call(this, t);
                object.updateProjectionMatrix();
            };
        };
        return this.action(node, object, key, i2);
    }
}
