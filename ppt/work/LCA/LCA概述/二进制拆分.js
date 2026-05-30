import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg);
const kDepth = sd.rand(33, 80);
const ans = new sd.Math(svg, `${kDepth}=`);
const p = sd.Pointer(arr, " ", "t", 10, 30);

sd.init(() => {
    arr.pushArray(getBinaryExpression(kDepth));
    arr.cx(250);
    ans.x(arr.x()).y(arr.my() + 60);
    sd.Label(arr, kDepth);
});

sd.main(async () => {
    await sd.pause();
    let expr = `${kDepth}=`;
    let cnt = 0;
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        const color = arr.text(i) === "0" ? C.grey : C.green;
        arr.startAnimate().color(i, color).endAnimate();
        if (color === C.green) {
            const old = ans.text();
            expr = expr + (cnt === 0 ? "" : "+") + (1 << (arr.length() - i - 1));
            cnt++;
            ans.startAnimate()
                .text(expr, [[old, old]])
                .endAnimate();
        }
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
