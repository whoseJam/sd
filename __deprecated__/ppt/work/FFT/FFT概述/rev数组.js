import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 8;
const logN = 3;
const arr = new sd.Array(svg).resize(n);
const afterAll = [];
let cnt = 0;

sd.init(() => {
    for (let i = 0; i < n; i++) {
        arr.element(i).value(new sd.Math(arr, `a_{${i}}`), R.center());
        arr.value(i).rank = i;
    }
});

sd.main(async () => {
    await Solve(arr, 50);
    await sd.pause();
    afterAll.forEach(callback => {
        callback();
    });
});

async function Solve(arr, gap) {
    if (arr.length() === 1) {
        const t1 = CastToBinStr(cnt++);
        const t2 = CastToBinStr(arr.value(0).rank);
        afterAll.push(() => {
            const lb1 = sd.Label(arr, t1, "bc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
            const lb2 = sd.Label(arr, t2, "bc", 20, 23).opacity(0).startAnimate().opacity(1).endAnimate();
            if (t1 === "000") {
                const t3 = new sd.Text(svg, "现在位置二进制表示").fontSize(20);
                const t4 = new sd.Text(svg, "原来位置二进制表示").fontSize(20);
                t3.mx(lb1.x() - 20)
                    .y(lb1.y())
                    .opacity(0)
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
                t4.mx(lb2.x() - 20)
                    .y(lb2.y())
                    .opacity(0)
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
            }
        });
        return;
    }

    const n = arr.length();
    const f0 = new sd.Array(svg);
    const f1 = new sd.Array(svg);

    f0.x(arr.x() - gap).y(arr.my() + 40);
    f1.x(arr.cx() + gap).y(arr.my() + 40);

    await sd.pause();
    f0.startAnimate().resize(n / 2);
    f1.startAnimate().resize(n / 2);
    for (let i = 0; i < n; i++) {
        const math = new sd.Math(svg, arr.value(i).math()).center(arr.value(i).center());
        math.rank = arr.value(i).rank;
        if (!(i & 1)) {
            f0.element(i / 2).value(math.onEnter(EN.moveTo()), R.center());
        } else {
            f1.element((i - 1) / 2).value(math.onEnter(EN.moveTo()), R.center());
        }
    }
    f0.endAnimate();
    f1.endAnimate();
    sd.Link(arr, f0, sd.Line, "cx", "cy", "cx", "cy").startAnimate().pointStoT().endAnimate().arrow();
    sd.Link(arr, f1, sd.Line, "cx", "cy", "cx", "cy").startAnimate().pointStoT().endAnimate().arrow();

    await Solve(f0, gap / 2);
    await Solve(f1, gap / 2);
}

function CastToBinStr(x) {
    let ans = "";
    for (let i = 0; i < logN; i++) {
        ans = String((x >> i) & 1) + ans;
    }
    return ans;
}
