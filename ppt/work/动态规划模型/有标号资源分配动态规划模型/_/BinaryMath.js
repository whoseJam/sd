import * as sd from "@/sd";

export function binaryMath(n) {
    const svg = sd.svg();

    let label = "0".repeat(n);
    let start = 1;
    const math = new sd.Math(svg, label);
    math.start = function (s) {
        start = s;
        return this;
    };
    math.set = function (i, f) {
        i -= start;
        label = `${label.slice(0, i)}${f}${label.slice(i + 1)}`;
        this.text(label);
        return this;
    };
    return math;
}
