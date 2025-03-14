import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class Animate {
    constructor(parent) {
        this.parent = parent;
        this.animating = false;
        this.frame = -1;
        this.start = 0;
        this.end = 0;
    }
    check() {
        if (this.frame !== window.CURRENT_FRAME) {
            this.frame = window.CURRENT_FRAME;
            this.start = 0;
            this.end = 0;
            this.animating = false;
        }
    }
    startAnimate() {
        this.check();
        let l, r;
        if (arguments.length === 0) {
            l = this.start;
            r = l + 300;
        } else if (arguments.length === 1) {
            const arg0 = arguments[0];
            if (typeof arg0 === "number") {
                l = this.start;
                r = l + arg0;
            } else {
                l = arg0.delay();
                r = l + arg0.duration();
            }
        } else {
            const arg0 = arguments[0];
            const arg1 = arguments[1];
            if (typeof arg0 !== "number" || typeof arg1 !== "number") ErrorLauncher.invalidArguments();
            l = arg0;
            r = arg1;
        }
        this.start = l;
        this.end = r;
        this.animating = true;
        this.parent._.children.forEach(child => child.startAnimate(this.parent));
    }
    endAnimate() {
        this.check();
        this.start = this.end;
        this.parent._.children.forEach(child => child.endAnimate());
        this.animating = false;
    }
    after(delay) {
        this.check();
        if (typeof delay !== "number") delay = delay.delay();
        this.start = delay;
        this.end = delay;
        this.parent._.children.forEach(child => child.after(delay));
    }
    delay() {
        this.check();
        return this.start;
    }
    duration() {
        this.check();
        return this.end - this.start;
    }
    isAnimating() {
        this.check();
        return this.animating;
    }
}
