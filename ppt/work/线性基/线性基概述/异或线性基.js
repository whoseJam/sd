import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = new sd.Grid(svg).startN(1).startM(1).n(n).m(n);
const data = [1, 5, 9, 4];
let linearSet = sd.make1d(n + 5);
let currentCount = 0;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        sd.Label(grid.element(I(i), I(n)), `在第${i}位上一定是1的基向量`);
    }
});

sd.main(async () => {
    for (let i = 0; i < data.length; i++) {
        await insert(data[i]);
    }
});

async function insert(v) {
    await sd.pause();
    let last = undefined;
    const math = new sd.Math(svg, castBinToStr(v))
        .cx(grid.cx())
        .my(grid.y() - 20)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    for (let i = n; i >= 1; i--) {
        if ((v >> (i - 1)) & 1) {
            await sd.pause();
            math.startAnimate();
            if (last) math.color(last, C.black);
            math.color(I(i), C.red);
            math.endAnimate();
            if (linearSet[i]) {
                v ^= linearSet[i];
                await sd.pause();
                math.startAnimate().transformMath(castBinToStr(v)).endAnimate().color(I(i), C.red);
            } else {
                linearSet[i] = v;
                currentCount++;
                await sd.pause();
                grid.startAnimate();
                for (let j = 1; j <= n; j++) grid.value(I(i), I(j), (v >> (j - 1)) & 1);
                grid.endAnimate();
                math.startAnimate().opacity(0).endAnimate().remove();
                return;
            }
            last = I(i);
        }
    }
    await sd.pause();
    math.startAnimate().opacity(0).endAnimate().remove();
}

function I(i) {
    return n - i + 1;
}

function castBinToStr(v) {
    let ans = "";
    for (let i = n; i >= 1; i--) ans = ans + "{" + String((v >> (i - 1)) & 1) + "}";
    return ans;
}
