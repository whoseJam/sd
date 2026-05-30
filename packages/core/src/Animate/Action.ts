import { Animate } from "@/Animate/Animate";
import { InterpFunction, InterpObject, LazyInterpFunction } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { SDEasingFunction } from "@/Math/EasingFunction";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Action {
    static stopFlag = 1 << 0;
    static hideFlag = 1 << 1;
    static firstCallFlag = 1 << 2;
    t: number;
    l: number;
    r: number;
    frame: number;
    source: any;
    target: any;
    _source: any;
    _target: any;
    interp?: InterpObject;
    lazyInterp?: LazyInterpFunction;
    timingFunction: SDEasingFunction;
    entity: any;
    animatedKey: string;
    reverse: boolean;
    next: Action;
    prev: Action;
    flag: number;
    constructor(action: Action);
    constructor(
        l: number,
        r: number,
        source: any,
        target: any,
        interp: InterpObject | InterpFunction | LazyInterpFunction,
        timingFunction: SDEasingFunction,
        entity: SDNode | RenderNode,
        animatedKey: string
    );
    constructor(
        l: number | Action,
        r?: number,
        source?: any,
        target?: any,
        interp?: InterpObject | InterpFunction | LazyInterpFunction,
        timingFunction?: SDEasingFunction,
        entity?: SDNode | RenderNode,
        animatedKey?: string
    ) {
        this.t = 0;
        this.reverse = false;
        if (l instanceof Action) {
            const other = arguments[0];
            this.l = other.l;
            this.r = other.r;
            this.source = other.source;
            this.target = other.target;
            this._source = other._source;
            this._target = other._target;
            this.interp = other.interp;
            this.timingFunction = other.timingFunction;
            this.entity = other.entity;
            this.animatedKey = other.animatedKey;
            this.frame = other.frame;
            this.next = undefined;
            this.flag = Action.firstCallFlag | (other.flag & Action.hideFlag);
        } else {
            this.l = l + Window.ACTION_DELAY;
            this.r = r + Window.ACTION_DELAY;
            this.source = source;
            this.target = target;
            if (interp instanceof InterpObject) {
                this.interp = interp;
                this.lazyInterp = undefined;
            } else if (interp.length === 1) {
                this.interp = new InterpObject(interp as InterpFunction);
                this.lazyInterp = undefined;
            } else {
                this.interp = undefined;
                this.lazyInterp = interp as LazyInterpFunction;
            }
            this.timingFunction = timingFunction;
            this.entity = entity;
            this.animatedKey = animatedKey;
            this.frame = Window.CURRENT_FRAME;
            this.next = undefined;
            this.flag = Action.firstCallFlag;
            Animate.push(this);
        }
    }
    tick(t: number) {
        if (!this.interp) {
            this.set(Action.stopFlag);
            return true;
        }
        if (t < this.l) return false;
        Window.ACTION_TICK++;
        if (this.l < this.r - 1) {
            const k0 = this.timingFunction((t - this.l) / (this.r - this.l));
            const k1 = this.is(Action.firstCallFlag) ? 0 : t > this.r ? 1 : k0;
            if (k1 === 0) {
                this.interp.onInit(this);
                this.interp.onBeforeInterp(this);
            }
            if (this.interp) this.interp.call(this, k1);
            if (k1 === 1) this.set(Action.stopFlag);
            if (k1 === 1) this.interp.onAfterInterp(this);
            this.unset(Action.firstCallFlag);
        } else {
            const k1 = this.is(Action.firstCallFlag) ? 0 : 1;
            if (k1 === 0) {
                this.interp.onInit(this);
                this.interp.onBeforeInterp(this);
            }
            if (this.interp) this.interp.call(this, k1);
            if (k1 === 1) this.set(Action.stopFlag);
            if (k1 === 1) this.interp.onAfterInterp(this);
            this.unset(Action.firstCallFlag);
            if (k1 === 0) this.tick(t);
        }
        Window.ACTION_TICK--;
        return true;
    }
    forceToFinish() {
        this.tick(this.r + 5);
        if (!this.is(Action.stopFlag)) this.tick(this.r + 5);
    }
    toString() {
        return `[${this.l}, ${this.r}] animatedKey=${this.animatedKey} source=${this.source} target=${this.target} id=${this.entity.id} frame=${this.frame}`;
    }
    is(flag: number) {
        return (this.flag & flag) != 0;
    }
    set(flag: number) {
        this.flag |= flag;
    }
    unset(flag: number) {
        this.flag &= ~flag;
    }
    clone() {
        if (this.lazyInterp) return undefined;
        return new Action(this);
    }
}
