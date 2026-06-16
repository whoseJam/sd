import type { PathOper, PathOpers } from "@/node/path/path-engine";
import type { SDRGBAColor } from "@/utility/color";

import { Action } from "@/animate/action";
import { PathEngine } from "@/node/path/path-engine";
import { Color } from "@/utility/color";

const INTERP_CREATOR = Symbol("InterpCreator");
const LAZY_INTERP = Symbol("LazyInterp");

export type InterpFunction = (this: Action, t: number) => void;
export type LazyInterpFunction = ((
  l: number,
  r: number,
  source: any,
  target: any,
) => void) & {
  [LAZY_INTERP]: true;
};
export type InterpCreator = ((object: any, key: string) => InterpObject) & {
  [INTERP_CREATOR]: true;
};
// Phantom-typed wrapper. valueType exists only at the type level so
// `pushAction` can infer from/to types from the interp argument —
// passing fill: 5 with colorInterp becomes a TS error instead of a
// runtime crash inside Color.toRGBA.
export type InterpKind<T> = InterpCreator & {
  readonly valueType?: T;
};
type InitFunction = (this: Action) => void;
type BeforeInterpFunction = (this: Action) => void;
type AfterInterpFunction = (this: Action) => void;
type AttrTarget = { setAttribute(key: string, value: any): void };

function setter(
  object: AttrTarget,
  key: string,
): (this: Action, value: any) => void {
  return function (value) {
    this.entity.renderAttribute(object, key, value);
  };
}

function interpCreator<T = any>(
  fn: (object: any, key: string) => InterpObject,
): InterpKind<T> {
  return Object.assign(fn, {
    [INTERP_CREATOR]: true as const,
  }) as InterpKind<T>;
}

export type LazyInterpKind<T> = LazyInterpFunction & {
  readonly valueType?: T;
};

export function lazyInterp<T = any>(
  fn: (l: number, r: number, source: T, target: T) => void,
): LazyInterpKind<T> {
  return Object.assign(fn, {
    [LAZY_INTERP]: true as const,
  }) as LazyInterpKind<T>;
}

export const isInterpCreator = (x: unknown): x is InterpCreator =>
  typeof x === "function" && (x as any)[INTERP_CREATOR] === true;

export const isLazyInterpFunction = (x: unknown): x is LazyInterpFunction =>
  typeof x === "function" && (x as any)[LAZY_INTERP] === true;

export class InterpObject {
  inited: boolean;
  initFn: InitFunction;
  beforeFn: BeforeInterpFunction;
  afterFn: AfterInterpFunction;
  fn: InterpFunction;
  constructor(callback: InterpFunction) {
    this.fn = callback;
    this.inited = false;
    this.initFn = () => {};
    this.beforeFn = () => {};
    this.afterFn = () => {};
  }
  call(action: Action, t: number): void {
    this.fn.call(action, t);
  }
  onInit(call: InitFunction | Action) {
    if (call instanceof Action) {
      if (this.inited) return;
      this.inited = true;
      return this.initFn.call(call);
    }
    this.initFn = call;
    return this;
  }
  onBeforeInterp(call: BeforeInterpFunction | Action) {
    if (call instanceof Action) return this.beforeFn.call(call);
    this.beforeFn = call;
    return this;
  }
  onAfterInterp(call: AfterInterpFunction | Action) {
    if (call instanceof Action) return this.afterFn.call(call);
    this.afterFn = call;
    return this;
  }
}

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

export class Interp {
  static emptyInterp = interpCreator<never>(
    (_object, _key) => new InterpObject(function (_time: number) {}),
  );

  static exLengthInterp = interpCreator<string>((object, key) => {
    const set = setter(object, key);
    const parse = (value: string) => +value.slice(0, -2);
    return new InterpObject(function (t) {
      set.call(this, `${lerp(this.preparedSource, this.preparedTarget, t)}ex`);
    }).onInit(function () {
      this.preparedSource = parse(this.source);
      this.preparedTarget = parse(this.target);
    });
  });

  static numberInterp = interpCreator<number>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      set.call(this, lerp(this.source, this.target, t));
    });
  });

  static pixelInterp = interpCreator<number>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      set.call(this, `${lerp(this.source, this.target, t)}px`);
    });
  });

  static colorInterp = interpCreator<SDRGBAColor>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      const A = this.preparedSource;
      const B = this.preparedTarget;
      set.call(this, {
        r: lerp(A.r, B.r, t),
        g: lerp(A.g, B.g, t),
        b: lerp(A.b, B.b, t),
        a: lerp(A.a, B.a, t),
      });
    }).onInit(function () {
      this.preparedSource = Color.toRGBA(this.source);
      this.preparedTarget = Color.toRGBA(this.target);
    });
  });

  static stringInterp = interpCreator<never>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      if (!this.reverse && t === 1) set.call(this, this.target);
      if (this.reverse && t === 0) set.call(this, this.target);
    });
  });

  static stringBlankInMiddleInterp = interpCreator<never>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      if (t === 0) set.call(this, " ");
      if (t === 1) set.call(this, this.target);
    });
  });

  static childBlankInMiddleInterp = interpCreator<never>((object, _key) => {
    return new InterpObject(function (t) {
      if (t === 0 && this.source) object.__removeChild(this.source);
      if (t === 1 && this.target) object.__append(this.target);
    });
  });

  static arrayInterp = interpCreator<Array<number>>((object, key) => {
    const set = setter(object, key);
    const toArr = (value: Array<number> | number) =>
      typeof value === "number" ? [value] : value;
    return new InterpObject(function (t) {
      const A = this.preparedSource;
      const B = this.preparedTarget;
      const len = Math.max(A.length, B.length);
      const ans = [];
      for (let i = 0; i < len; i++) ans.push(lerp(A[i] ?? 0, B[i] ?? 0, t));
      set.call(this, ans);
    }).onInit(function () {
      this.preparedSource = toArr(this.source);
      this.preparedTarget = toArr(this.target);
    });
  });

  static vectorInterp = interpCreator<[number, number]>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      const A = this.source;
      const B = this.target;
      set.call(this, [lerp(A[0], B[0], t), lerp(A[1], B[1], t)]);
    });
  });

  static matrixInterp = interpCreator<DOMMatrix | SVGMatrix>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      const A = this.source;
      const B = this.target;
      const v = (k: "a" | "b" | "c" | "d" | "e" | "f") => lerp(A[k], B[k], t);
      set.call(
        this,
        `matrix(${v("a")}, ${v("b")}, ${v("c")}, ${v("d")}, ${v("e")}, ${v("f")})`,
      );
    });
  });

  static boxInterp = interpCreator<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      const A = this.source;
      const B = this.target;
      set.call(
        this,
        `${lerp(A.x, B.x, t)} ${lerp(A.y, B.y, t)} ${lerp(A.width, B.width, t)} ${lerp(A.height, B.height, t)}`,
      );
    });
  });

  static translateInterp = interpCreator<[number, number]>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      const A = this.source;
      const B = this.target;
      set.call(
        this,
        `translate(${lerp(A[0], B[0], t)},${lerp(A[1], B[1], t)})`,
      );
    });
  });

  static pathInterp = interpCreator<string>((object, key) => {
    const set = setter(object, key);
    return new InterpObject(function (t) {
      const A = this.preparedSource;
      const B = this.preparedTarget;
      const operators: PathOpers = [];
      for (let i = 0; i < A.length; i++) {
        const operator: PathOper = [A[i][0]];
        for (let j = 1; j < A[i].length; j++)
          operator.push(lerp(A[i][j], B[i][j], t));
        operators.push(operator);
      }
      set.call(this, PathEngine.toString(operators));
    })
      .onInit(function () {
        [this.preparedSource, this.preparedTarget] = PathEngine.toCubics(
          this.source,
          this.target,
        );
      })
      .onAfterInterp(function () {
        set.call(this, this.target);
      });
  });

  static pointsInterp = interpCreator<Array<[number, number]>>(
    (object, key) => {
      const set = setter(object, key);
      const pad = (value: Array<[number, number]>, length: number) => {
        while (value.length < length) value.push(value[value.length - 1]);
        return value;
      };
      return new InterpObject(function (t) {
        const A = this.preparedSource;
        const B = this.preparedTarget;
        const ans = [];
        for (let i = 0; i < A.length; i++)
          ans.push([lerp(A[i][0], B[i][0], t), lerp(A[i][1], B[i][1], t)]);
        set.call(this, ans);
      }).onInit(function () {
        const length = Math.max(this.source.length, this.target.length);
        this.preparedSource = pad(this.source, length);
        this.preparedTarget = pad(this.target, length);
      });
    },
  );
}
