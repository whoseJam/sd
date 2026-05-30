type SDEasingFunctionLiteral =
    | "linear"
    | "ease-in"
    | "easeIn"
    | "ease-out"
    | "easeOut"
    | "ease-in-out"
    | "easeInOut"
    | "quad-in"
    | "quadIn"
    | "quad-out"
    | "quadOut"
    | "quad-in-out"
    | "quadInOut"
    | "cubic-in"
    | "cubicIn"
    | "cubic-out"
    | "cubicOut"
    | "cubic-in-out"
    | "cubicInOut"
    | "elastic-in"
    | "elasticIn"
    | "elastic-out"
    | "elasticOut"
    | "elastic-in-out"
    | "elasticInOut"
    | "bounce-in"
    | "bounceIn"
    | "bounce-out"
    | "bounceOut"
    | "bounce-in-out"
    | "bounceInOut";
export type SDEasingFunction = SDEasingFunctionLiteral | ((t: number) => number);

export class EasingFunction {
    /**
     * Linear timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The linear interpolation value.
     */
    static linear(t: number) {
        return t;
    }

    /**
     * Ease-in timing function (equivalent to cubic-bezier(0.42, 0, 1, 1)).
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static easeIn = EasingFunction.cubicBezier(0.42, 0, 1, 1);

    /**
     * Ease-out timing function (equivalent to cubic-bezier(0, 0, 0.58, 1)).
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static easeOut = EasingFunction.cubicBezier(0, 0, 0.58, 1);

    /**
     * Ease-in-out timing function (equivalent to cubic-bezier(0.42, 0, 0.58, 1)).
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static easeInOut = EasingFunction.cubicBezier(0.42, 0, 0.58, 1);

    /**
     * Quadratic ease-in timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static quadIn(t: number) {
        return t * t;
    }

    /**
     * Quadratic ease-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static quadOut(t: number) {
        return 1 - (1 - t) * (1 - t);
    }

    /**
     * Quadratic ease-in-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static quadInOut(t: number) {
        return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    }

    /**
     * Cubic ease-in timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static cubicIn(t: number) {
        return t * t * t;
    }

    /**
     * Cubic ease-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static cubicOut(t: number) {
        return 1 - (1 - t) * (1 - t) * (1 - t);
    }

    /**
     * Cubic ease-in-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static cubicInOut(t: number) {
        return t < 0.5 ? 4 * t * t * t : 1 - 4 * (1 - t) * (1 - t) * (1 - t);
    }

    /**
     * Elastic ease-in timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static elasticIn(t: number) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 6;
        return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    }

    /**
     * Elastic ease-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static elasticOut(t: number) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 6;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    /**
     * Elastic ease-in-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static elasticInOut(t: number) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c5 = (2 * Math.PI) / 8;
        return t < 0.5
            ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
            : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    }

    /**
     * Bounce ease-in timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static bounceIn(t: number) {
        return 1 - EasingFunction.bounceOut(1 - t);
    }

    /**
     * Bounce ease-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static bounceOut(t: number) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            const t2 = t - 1.5 / d1;
            return n1 * t2 * t2 + 0.75;
        } else if (t < 2.5 / d1) {
            const t2 = t - 2.25 / d1;
            return n1 * t2 * t2 + 0.9375;
        } else {
            const t2 = t - 2.625 / d1;
            return n1 * t2 * t2 + 0.984375;
        }
    }

    /**
     * Bounce ease-in-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static bounceInOut(t: number) {
        return t < 0.5 ? EasingFunction.bounceIn(t * 2) * 0.5 : EasingFunction.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    }

    /**
     * Back ease-in timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static backIn(t: number) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    }

    /**
     * Back ease-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static backOut(t: number) {
        const s = 1.70158;
        return 1 - (1 - t) * (1 - t) * ((s + 1) * (1 - t) - s);
    }

    /**
     * Back ease-in-out timing function.
     * @param t - Time progress from 0 to 1.
     * @returns The eased value.
     */
    static backInOut(t: number) {
        const s = 1.70158;
        const s2 = s * 1.525;
        if (t < 0.5) {
            const t2 = 2 * t;
            return (t2 * t2 * ((s2 + 1) * t2 - s2)) / 2;
        } else {
            const t2 = 2 * t - 2;
            return (t2 * t2 * ((s2 + 1) * t2 + s2) + 2) / 2;
        }
    }

    /**
     * Creates a cubic bezier timing function.
     * This implementation follows the CSS cubic-bezier specification.
     * @param x1 - X coordinate of the first control point (0-1).
     * @param y1 - Y coordinate of the first control point.
     * @param x2 - X coordinate of the second control point (0-1).
     * @param y2 - Y coordinate of the second control point.
     * @returns A timing function that maps time to progress.
     */
    static cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
        const calcBezier = (t: number, a1: number, a2: number) => {
            return 3 * (1 - t) * (1 - t) * t * a1 + 3 * (1 - t) * t * t * a2 + t * t * t;
        };

        const getSlope = (t: number, a1: number, a2: number) => {
            return 3 * (1 - t) * (1 - t) * a1 + 6 * (1 - t) * t * (a2 - a1) + 3 * t * t * (1 - a2);
        };

        const getTForX = (x: number) => {
            let t = x;
            for (let i = 0; i < 8; i++) {
                const currentX = calcBezier(t, x1, x2) - x;
                if (Math.abs(currentX) < 0.001) break;
                const currentSlope = getSlope(t, x1, x2);
                if (Math.abs(currentSlope) < 0.000001) break;
                t -= currentX / currentSlope;
            }
            return t;
        };

        return function (t: number): number {
            if (t === 0) return 0;
            if (t === 1) return 1;
            const solvedT = getTForX(t);
            return calcBezier(solvedT, y1, y2);
        };
    }

    static toEasingFunction(easing: SDEasingFunction): (t: number) => number {
        if (easing === undefined) return this.easeInOut;
        if (typeof easing === "function") return easing;
        if (easing.includes("-"))
            easing = easing.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase()) as SDEasingFunctionLiteral;
        return this[easing];
    }
}

export function easing() {
    return EasingFunction;
}
