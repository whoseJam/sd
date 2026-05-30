import { Action } from "@/Animate/Action";
import { PathEngine, PathOper, PathOpers } from "@/Node/Path/PathEngine";
import { Color } from "@/Utility/Color";

export type InterpFunction = (this: Action, t: number) => void;
export type LazyInterpFunction = (l: number, r: number, source: any, target: any) => void;
export type InterpCreator = (object: any, key: string) => InterpObject;
type InitFunction = (this: Action) => void;
type BeforeInterpFunction = (this: Action) => void;
type AfterInterpFunction = (this: Action) => void;
type Setter = (value: any) => void;

function setter(object: any, key: string): Setter {
    if (object.setAttribute) {
        return function (value: any) {
            object.setAttribute(key, value);
        };
    } else if (typeof object[key] === "function") {
        return function (value: any) {
            object[key](value);
        };
    } else if (object[key] !== undefined) {
        return function (value: any) {
            object[key] = value;
        };
    }
    throw new Error(`Unknown key: ${key}`);
}

export class InterpObject {
    inited: boolean;
    onInit_: InitFunction;
    onBeforeInterp_: BeforeInterpFunction;
    onAfterInterp_: AfterInterpFunction;
    callback_: InterpFunction;
    constructor(callback: InterpFunction) {
        this.callback_ = callback;
        this.inited = false;
        this.onInit_ = () => {};
        this.onBeforeInterp_ = () => {};
        this.onAfterInterp_ = () => {};
    }
    call(action: Action, t: number): void {
        this.callback_.call(action, t);
    }
    onInit(call: InitFunction | Action) {
        if (call instanceof Action) {
            if (this.inited) return;
            this.inited = true;
            return this.onInit_.call(call);
        }
        this.onInit_ = call;
        return this;
    }
    onBeforeInterp(call: BeforeInterpFunction | Action) {
        if (call instanceof Action) return this.onBeforeInterp_.call(call);
        this.onBeforeInterp_ = call;
        return this;
    }
    onAfterInterp(call: AfterInterpFunction | Action) {
        if (call instanceof Action) return this.onAfterInterp_.call(call);
        this.onAfterInterp_ = call;
        return this;
    }
}

export class Interp {
    static emptyInterp(object: any, key: string) {
        return new InterpObject(function (t: number) {});
    }
    static exLengthInterp(object: any, key: string) {
        const set = setter(object, key);
        const f = (value: string) => +value.slice(0, -2);
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const current = A * (1 - t) + B * t;
            set(current + "ex");
        }).onInit(function () {
            this._source = f(this.source);
            this._target = f(this.target);
        });
    }
    static numberInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(current);
        });
    }
    static opacityInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(current);
            if (t === 1 && !this.entity._.clickableCalled)
                object.setAttribute("pointer-events", current === 0 ? "none" : "auto");
        });
    }
    static pixelInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = A * (1 - t) + B * t;
            set(`${current}px`);
        });
    }
    static colorInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const fRGBA = this._source;
            const tRGBA = this._target;
            const r = fRGBA.r * (1 - t) + tRGBA.r * t;
            const g = fRGBA.g * (1 - t) + tRGBA.g * t;
            const b = fRGBA.b * (1 - t) + tRGBA.b * t;
            const a = fRGBA.a * (1 - t) + tRGBA.a * t;
            set({ r, g, b, a });
        }).onInit(function () {
            this._source = Color.toRGBA(this.source);
            this._target = Color.toRGBA(this.target);
        });
    }

    static stringInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            if (!this.reverse && t === 1) set(this.target);
            if (this.reverse && t === 0) set(this.target);
        });
    }

    static stringBlankInMiddleInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            if (t === 0) set(" ");
            if (t === 1) set(this.target);
        });
    }

    static childBlankInMiddleInterp(object: any, key?: string) {
        return new InterpObject(function (t) {
            if (t === 0 && this.source) object.__removeChild(this.source);
            if (t === 1 && this.target) object.__append(this.target);
        });
    }

    static arrayInterp(object: any, key: string) {
        const set = setter(object, key);
        const f = (value: Array<number> | number) => {
            if (typeof value === "number") return [value];
            return value;
        };
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const len = Math.max(A.length, B.length);
            const ans = [];
            for (let i = 0; i < len; i++) {
                const va = i < A.length ? A[i] : 0;
                const vb = i < B.length ? B[i] : 0;
                const v = va * (1 - t) + vb * t;
                ans.push(v);
            }
            set(ans);
        }).onInit(function () {
            this._source = f(this.source);
            this._target = f(this.target);
        });
    }

    static vectorInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const x = A[0] * (1 - t) + B[0] * t;
            const y = A[1] * (1 - t) + B[1] * t;
            set([x, y]);
        });
    }

    static matrixInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const current = {
                a: A.a * (1 - t) + B.a * t,
                b: A.b * (1 - t) + B.b * t,
                c: A.c * (1 - t) + B.c * t,
                d: A.d * (1 - t) + B.d * t,
                e: A.e * (1 - t) + B.e * t,
                f: A.f * (1 - t) + B.f * t,
            };
            set(`matrix(${current.a}, ${current.b}, ${current.c}, ${current.d}, ${current.e}, ${current.f})`);
        });
    }
    static boxInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const x = A.x * (1 - t) + B.x * t;
            const y = A.y * (1 - t) + B.y * t;
            const width = A.width * (1 - t) + B.width * t;
            const height = A.height * (1 - t) + B.height * t;
            set(`${x} ${y} ${width} ${height}`);
        });
    }
    static translateInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const tx = this.source[0] + (this.target[0] - this.source[0]) * t;
            const ty = this.source[1] + (this.target[1] - this.source[1]) * t;
            set(`translate(${tx},${ty})`);
        });
    }
    static pathInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const operators: PathOpers = [];
            for (let i = 0; i < A.length; i++) {
                const operator: PathOper = [A[i][0]];
                for (let j = 1; j < A[i].length; j++) operator.push(A[i][j] * (1 - t) + B[i][j] * t);
                operators.push(operator);
            }
            set(PathEngine.toString(operators));
        })
            .onInit(function () {
                [this._source, this._target] = PathEngine.toCubics(this.source, this.target);
            })
            .onAfterInterp(function () {
                set(this.target);
            });
    }
    static pointsInterp(object: any, key?: string) {
        const set = setter(object, key);
        const f = (value: Array<[number, number]>, length: number) => {
            while (value.length < length) value.push(value[value.length - 1]);
            return value;
        };
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const ans = [];
            for (let i = 0; i < A.length; i++)
                ans.push([A[i][0] * (1 - t) + B[i][0] * t, A[i][1] * (1 - t) + B[i][1] * t]);
            set(ans);
        }).onInit(function () {
            const length = Math.max(this.source.length, this.target.length);
            this._source = f(this.source, length);
            this._target = f(this.target, length);
        });
    }
}
