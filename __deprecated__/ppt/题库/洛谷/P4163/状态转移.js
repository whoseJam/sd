import * as sd from "@/sd";

class BinaryString extends sd.TextSVG {
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

const svg = sd.svg();
const C = sd.color();
const data = [3, 4, 2, 1, 4, 3, 1, 6, 6];
const mask = [5, 2, 7, 3];
const n = data.length;
const posK = 4;
const arr = new sd.Array(svg).start(1);
const ans = new sd.Array(svg).dy(80).start(1);
const status = new BinaryString(svg, n);

sd.init(() => {
    arr.pushArray(data);
    mask.forEach(i => {
        ans.push(arr.text(i));
        arr.color(i, C.grey);
        sd.Label(ans.lastElement(), i, "tc", 15, 0);
        status.value(i, 1);
    });
    status.cx(arr.cx()).y(arr.my() + 120);
});

sd.main(async () => {
    await sd.pause();
    const brace = sd.Brace(ans, "b");
    brace.brace(ans.start(), ans.end()).startAnimate().pointTtoS().value("r").endAnimate();
    await sd.pause();
    sd.Pointer(arr, "k").startAnimate().moveTo(posK).endAnimate();
    await sd.pause();
    ans.startAnimate().push(arr.text(posK)).endAnimate();
    sd.Label(ans.lastElement(), posK, "tc", 15, 0);
    await sd.pause();
    brace.startAnimate().brace(ans.start(), ans.end()).endAnimate();
    status.startAnimate().value(posK, 1).endAnimate();
    arr.startAnimate().color(posK, C.grey).endAnimate();
});
