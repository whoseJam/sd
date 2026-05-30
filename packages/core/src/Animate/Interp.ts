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
type AttrTarget = { setAttribute(key: string, value: any): void };

function setter(object: AttrTarget, key: string): Setter {
    return value => object.setAttribute(key, value);
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

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

export class Interp {
    static emptyInterp(object: any, key: string) {
        return new InterpObject(function (t: number) {});
    }
    static exLengthInterp(object: any, key: string) {
        const set = setter(object, key);
        const parse = (value: string) => +value.slice(0, -2);
        return new InterpObject(function (t) {
            set(`${lerp(this._source, this._target, t)}ex`);
        }).onInit(function () {
            this._source = parse(this.source);
            this._target = parse(this.target);
        });
    }
    static numberInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            set(lerp(this.source, this.target, t));
        });
    }
    static pixelInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            set(`${lerp(this.source, this.target, t)}px`);
        });
    }
    static colorInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            set({
                r: lerp(A.r, B.r, t),
                g: lerp(A.g, B.g, t),
                b: lerp(A.b, B.b, t),
                a: lerp(A.a, B.a, t),
            });
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
        const toArr = (value: Array<number> | number) => (typeof value === "number" ? [value] : value);
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const len = Math.max(A.length, B.length);
            const ans = [];
            for (let i = 0; i < len; i++) ans.push(lerp(A[i] ?? 0, B[i] ?? 0, t));
            set(ans);
        }).onInit(function () {
            this._source = toArr(this.source);
            this._target = toArr(this.target);
        });
    }

    static vectorInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            set([lerp(A[0], B[0], t), lerp(A[1], B[1], t)]);
        });
    }

    static matrixInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            const v = (k: "a" | "b" | "c" | "d" | "e" | "f") => lerp(A[k], B[k], t);
            set(`matrix(${v("a")}, ${v("b")}, ${v("c")}, ${v("d")}, ${v("e")}, ${v("f")})`);
        });
    }
    static boxInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            set(`${lerp(A.x, B.x, t)} ${lerp(A.y, B.y, t)} ${lerp(A.width, B.width, t)} ${lerp(A.height, B.height, t)}`);
        });
    }
    static translateInterp(object: any, key: string) {
        const set = setter(object, key);
        return new InterpObject(function (t) {
            const A = this.source;
            const B = this.target;
            set(`translate(${lerp(A[0], B[0], t)},${lerp(A[1], B[1], t)})`);
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
                for (let j = 1; j < A[i].length; j++) operator.push(lerp(A[i][j], B[i][j], t));
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
        const pad = (value: Array<[number, number]>, length: number) => {
            while (value.length < length) value.push(value[value.length - 1]);
            return value;
        };
        return new InterpObject(function (t) {
            const A = this._source;
            const B = this._target;
            const ans = [];
            for (let i = 0; i < A.length; i++) ans.push([lerp(A[i][0], B[i][0], t), lerp(A[i][1], B[i][1], t)]);
            set(ans);
        }).onInit(function () {
            const length = Math.max(this.source.length, this.target.length);
            this._source = pad(this.source, length);
            this._target = pad(this.target, length);
        });
    }
}
