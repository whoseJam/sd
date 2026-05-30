import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg);
const ans = new sd.Math(svg, "ans = 1");
const p = makeMathPointer();
const b = 142;

sd.init(() => {
    arr.pushArray(getBinaryExpression(b));
    ans.y(arr.my() + 80);
    sd.Label(arr, b);
});

sd.main(async () => {
    await sd.pause();
    let cur = arr.length() - 1;
    let miOfA = 1;
    let expr = "ans = 1";
    p.startAnimate().moveTo(cur).endAnimate();

    let tmp = b;
    while (tmp) {
        await sd.pause();
        if (tmp & 1) {
            expr = `${expr}\\times a^{${miOfA}}`;
            ans.math(expr);
        }

        if (cur > 0) {
            miOfA <<= 1;
            p.changeMath(`a^{${miOfA}}`).moveTo(cur - 1);
        } else {
            p.startAnimate().moveTo(null).endAnimate();
        }
        const color = arr.text(cur) === "0" ? C.grey : C.green;
        arr.startAnimate().color(cur, color).endAnimate();
        cur--;

        tmp = tmp >> 1;
    }
});

function getBinaryExpression(a) {
    let result = "";
    while (a) {
        result = (a & 1) + result;
        a = a >> 1;
    }
    return result;
}

function makeMathPointer() {
    const pointer = sd.Pointer(arr, " ", "t", 10, 30);
    pointer.childAs("math", new sd.Math(pointer, "a^1"), R.aside("bc"));
    pointer.changeMath = function (math) {
        this.child("math").math(math);
        return this;
    };
    return pointer;
}
