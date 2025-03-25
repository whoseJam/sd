import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

function hasChanged(oldValue, newValue, precise) {
    if (typeof oldValue === "number" && typeof newValue === "number") {
        if (typeof precise === "function") {
            return precise(oldValue, newValue);
        }
        return Math.abs(oldValue - newValue) > 1e-2;
    }
    return oldValue !== newValue;
}

class Queue {
    constructor(name) {
        this.label = `in${name}Queue`;
        this.queue = [];
    }
    pushFront(callback) {
        callback[this.label] = true;
        this.queue.unshift(callback);
    }
    pushBack(callback) {
        callback[this.label] = true;
        this.queue.push(callback);
    }
    has(callback) {
        return callback[this.label];
    }
    execute(init = false) {
        while (this.queue.length > 0) {
            const callback = this.queue[0];
            this.queue.shift();
            const effectManager = effectsMap.get(callback);
            if (init || effectManager.anyInputHasChanged()) callback();
            callback[this.label] = false;
        }
    }
}

const proxiesMap = new WeakMap(); // proxy -> object
const effectsMap = new WeakMap(); // effect -> EffectManager
const objectsMap = new WeakMap(); // object -> ObjectManager
const effectQueue = new Queue("Effect");
let globalAllowUpdate = true;
let globalActiveEffect = undefined;

class EffectManager {
    constructor(effect) {
        this.effect = effect;
        this.in = [];
        this.out = [];
    }
    clear() {
        this.in.forEach(link => {
            const objectManager = objectsMap.get(link.object);
            objectManager.outputEffects(link.key).delete(this.effect);
        });
        this.out.forEach(link => {
            const objectManager = objectsMap.get(link.object);
            objectManager.inputEffects(link.key).delete(this.effect);
        });
        [this.in, this.out] = [[], []];
    }
    pushInput(object, key, value) {
        for (let i = 0; i < this.in.length; i++) {
            if (this.in[i].key === key && this.in[i].object === object) {
                this.in[i].value = value;
                return;
            }
        }
        this.in.push({ object, key, value });
    }
    pushOutput(object, key, value) {
        for (let i = 0; i < this.out.length; i++) {
            if (this.out[i].key === key && this.out[i].object === object) {
                this.out[i].value = value;
                return;
            }
        }
        this.out.push({ object, key, value });
    }
    inputHasChanged(object, key) {
        const objectManager = objectsMap.get(object);
        const old = this.in.find(link => link.key === key && link.object === object);
        if (!old) ErrorLauncher.whatHappened();
        return hasChanged(old.value, object[key], objectManager.precise.get(key));
    }
    anyInputHasChanged() {
        for (let i = 0; i < this.in.length; i++) {
            const old = this.in[i];
            const objectManager = objectsMap.get(old.object);
            if (hasChanged(old.value, old.object[old.key], objectManager.precise.get(old.key))) return true;
        }
        return false;
    }
    outputUpdate(out) {
        this.out.forEach(current => {
            const objectManager = objectsMap.get(current.object);
            const old = out.find(link => link.key === current.key && link.object === current.object);
            if (!old) {
                const outEffectsSet = objectManager.outputEffects(current.key);
                outEffectsSet.forEach(effect => {
                    if (effectQueue.has(effect)) return;
                    effectQueue.pushBack(effect);
                });
            } else {
                const outEffectsSet = objectManager.outputEffects(current.key);
                outEffectsSet.forEach(effect => {
                    const _in = effectsMap.get(effect).in;
                    let i = 0;
                    for (; i < _in.length; i++) if (_in[i].key === current.key) break;
                    if (!hasChanged(current.value, _in[i].value, objectManager.precise.get(current.key))) return;
                    if (effectQueue.has(effect)) return;
                    effectQueue.pushBack(effect);
                });
            }
        });
    }
}

class ObjectManager {
    constructor(object, proxy) {
        this.proxy = proxy;
        this.object = object;
        this.inEffects = new Map();
        this.outEffects = new Map();
        this.precise = new Map();
    }
    inputEffects(key) {
        const inEffectsSet = this.inEffects.get(key);
        return inEffectsSet ? inEffectsSet : [];
    }
    outputEffects(key) {
        const outEffectsSet = this.outEffects.get(key);
        return outEffectsSet ? outEffectsSet : [];
    }
    pushInput(key, effect) {
        let inEffectsSet = this.inEffects.get(key);
        if (!inEffectsSet) {
            inEffectsSet = new Set();
            this.inEffects.set(key, inEffectsSet);
        }
        inEffectsSet.add(effect);
    }
    pushOutput(key, effect) {
        let outEffectsSet = this.outEffects.get(key);
        if (!outEffectsSet) {
            outEffectsSet = new Set();
            this.outEffects.set(key, outEffectsSet);
        }
        outEffectsSet.add(effect);
    }
}

export function afterEffect(callback) {
    callback();
}

export function freeze() {
    ErrorLauncher.warnNotImplementedYet("freeze");
}

export function unfreeze() {
    ErrorLauncher.warnNotImplementedYet("unfreeze");
}

export function setPrecise(proxy, key, type) {
    const object = proxiesMap.get(proxy);
    const objectManager = objectsMap.get(object);
    objectManager.precise.set(key, type);
}

export function reactive(object, father = undefined) {
    if (objectsMap.has(object)) return objectsMap.get(object).proxy;
    let associated = {};
    const proxy = new Proxy(object, {
        get: function (object, key, receiver) {
            const value = Reflect.get(object, key, receiver);
            traceInput(object, key, value);
            if (Check.isTypeOfSDNode(value)) return value;
            if (typeof value === "object") {
                return reactive(value, object);
            }
            return value;
        },
        set: function (object, key, value, receiver) {
            if (proxiesMap.get(object)) object = proxiesMap.get(object);
            if (proxiesMap.get(value)) value = proxiesMap.get(value);
            traceOutput(object, key, value);
            const newValue = value;
            const oldValue = Reflect.get(object, key, receiver);
            if (associated[key]) {
                if (hasChanged(oldValue, newValue) || (Array.isArray(object) && key === "length")) {
                    associated[key].forEach(callback => {
                        callback(newValue, oldValue);
                    });
                }
            }
            Reflect.set(object, key, value, receiver);
            triggerUpdate(object, key);
            return true;
        },
    });
    proxiesMap.set(proxy, object);
    objectsMap.set(object, new ObjectManager(object, proxy));
    object.associate = function (key, callback) {
        if (arguments.length === 0) return associated;
        const keys = key.split(".");
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                if (!associated[keys[i]]) associated[keys[i]] = [];
                associated[keys[i]].push(callback);
            } else {
                const str = keys.slice(i + 1).join(".");
                proxy[keys[i]].associate(str, callback);
            }
        }
    };
    object.merge = function (otherObject) {
        for (let key in otherObject) {
            object[key] = otherObject[key];
        }
    };
    return proxy;
}

export function effect(innerEffect, tag) {
    const effect = () => {
        window.EFFECT_COUNT++;
        let tmpEffect = undefined;
        let tmpQueue = undefined;
        if (globalActiveEffect) {
            [tmpEffect, tmpQueue] = [globalActiveEffect, effectQueue.queue];
            [globalActiveEffect, effectQueue.queue] = [undefined, []];
        }
        globalActiveEffect = effect;
        const effectManager = effectsMap.get(effect);
        const out = effectManager.out;
        effectManager.clear();
        innerEffect();
        effectManager.outputUpdate(out);
        globalActiveEffect = undefined;
        if (tmpEffect) {
            [globalActiveEffect, effectQueue.queue] = [tmpEffect, tmpQueue];
            [tmpEffect, tmpQueue] = [undefined, undefined];
        }
    };
    effect.freeze = function () {
        ErrorLauncher.warnNotImplementedYet("freeze");
    };
    effect.freezing = function () {
        ErrorLauncher.warnNotImplementedYet("freezing");
    };
    effect.unfreeze = function () {
        ErrorLauncher.warnNotImplementedYet("unfreeze");
    };
    effectsMap.set(effect, new EffectManager(effect));
    globalAllowUpdate = false;
    effectQueue.pushBack(effect);
    effect.tag = tag || innerEffect;
    effectQueue.execute(true);
    globalAllowUpdate = true;
    return effect;
}

export function object(proxy) {
    if (proxiesMap.get(proxy)) return proxiesMap.get(proxy);
    return proxy;
}

export function uneffect(effect) {
    const effectManager = effectsMap.get(effect);
    delete effectsMap[effect];
    effectManager.clear();
}

function traceInput(object, key, value) {
    if (!globalActiveEffect) return;
    const effectManager = effectsMap.get(globalActiveEffect);
    effectManager.pushInput(object, key, value);
    const objectManager = objectsMap.get(object);
    objectManager.pushOutput(key, globalActiveEffect);
}

function traceOutput(object, key, value) {
    if (!globalActiveEffect) return;
    const effectManager = effectsMap.get(globalActiveEffect);
    effectManager.pushOutput(object, key, value);
    const objectManager = objectsMap.get(object);
    objectManager.pushInput(key, globalActiveEffect);
}

function collectEffectOnDAG(queue, object, key) {
    const visitedObject = new Map();
    const visitedEffect = new Map();
    function dfs(object, key, lastEffect = undefined) {
        if (!visitedObject.has(object)) visitedObject.set(object, new Map());
        if (!visitedObject.get(object).has(key)) visitedObject.get(object).set(key, new Set());
        if (lastEffect && visitedObject.get(object).get(key).has(lastEffect)) return;
        if (lastEffect) visitedObject.get(object).get(key).add(lastEffect);
        const objectManager = objectsMap.get(object);
        const outEffectsSet = objectManager.outputEffects(key);
        outEffectsSet.forEach(effect => {
            const effectManager = effectsMap.get(effect);
            if (!visitedEffect.has(effect)) {
                visitedEffect.set(effect, {
                    degree: 0,
                });
            }
            if (lastEffect && lastEffect !== effect) visitedEffect.get(effect).degree++;
            effectManager.out.forEach(link => {
                dfs(link.object, link.key, effect);
            });
        });
    }
    dfs(object, key);
    const tmpQueue = [];
    visitedEffect.forEach((node, effect) => {
        if (node.degree === 0) tmpQueue.push(effect);
    });
    if (tmpQueue.length === 0) collectEffect(queue, object, key);
    while (tmpQueue.length > 0) {
        const effect = tmpQueue.shift();
        queue.pushBack(effect);
        const effectManager = effectsMap.get(effect);
        effectManager.out.forEach(link => {
            const objectManager = objectsMap.get(link.object);
            const outEffectsSet = objectManager.outputEffects(link.key);
            outEffectsSet.forEach(nextEffect => {
                if (!--visitedEffect.get(nextEffect).degree) {
                    tmpQueue.push(nextEffect);
                }
            });
        });
    }
}

function collectEffect(queue, object, key) {
    const objectManager = objectsMap.get(object);
    const outEffectsSet = objectManager.outputEffects(key);
    outEffectsSet.forEach(effect => {
        const effectManager = effectsMap.get(effect);
        if (!effectManager.inputHasChanged(object, key)) return;
        if (queue.has(effect)) return;
        queue.pushBack(effect);
    });
}

function triggerUpdate(object, key) {
    if (!globalAllowUpdate) return;
    globalAllowUpdate = false;
    collectEffectOnDAG(effectQueue, object, key);
    effectQueue.execute();
    globalAllowUpdate = true;
}

export function checkEffect(effect) {
    console.log("effect=", effect.tag);
    const effectManager = effectsMap.get(effect);
    console.log(effectManager.in);
    console.log(effectManager.out);
    console.log("");
}
