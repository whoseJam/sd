import * as sd from "@/sd";

export class BinaryString extends sd.TextSVG {
    constructor(target, n) {
        super(target);

        this.fontSize(25);
        this.vars.elements = [];
        this.vars.start = 1;
        for (let i = 1; i <= n; i++) this.vars.elements.push(0);

        this.effect("bin", () => {
            let result = "";
            for (const v of this.vars.elements) result = result + v;
            this.text(result);
        });
    }
    start(start) {
        if (arguments.length === 0) return this.vars.start;
        this.vars.start = start;
        return this;
    }
    end() {
        return this.start() + this.length() - 1;
    }
    length() {
        return this.vars.elements.length;
    }
    value(i, v) {
        i -= this.start();
        i = this.length() - i - 1;
        if (arguments.length === 1) return this.vars.elements[i];
        this.vars.elements[i] = v;
        return this;
    }
}
