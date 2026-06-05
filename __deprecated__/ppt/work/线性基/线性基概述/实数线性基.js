import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = new sd.Grid(svg).startN(1).startM(1).n(n).m(n);
const data = [
    [1, 0, 3, 2, 4],
    [2, 1, 3, 0, 0],
    [2, 1, 6, 2, 4],
    [4, 2, 1, 0, 8],
];
let linearSet = sd.make1d(n + 5);
let currentCount = 0;

sd.init(() => {
    data.forEach(item => {
        item.unshift(0);
    });
    for (let i = 1; i <= n; i++) {
        sd.Label(grid.element(I(i), I(n)), `在第${i}位上一定不为0的基向量`);
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
    const arr = new sd.Array(svg).start(1);
    for (let i = n; i >= 1; i--) arr.push(v[i]);
    arr.cx(grid.cx())
        .my(grid.y() - 20)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    for (let i = n; i >= 1; i--) {
        if (v[i]) {
            await sd.pause();
            arr.startAnimate();
            if (last) arr.color(last, C.white);
            arr.color(I(i), C.red);
            arr.endAnimate();
            if (linearSet[i]) {
                const k = v[i] / linearSet[i][i];
                await sd.pause();
                arr.startAnimate();
                for (let j = 1; j <= n; j++) {
                    v[j] -= k * linearSet[i][j];
                    arr.value(I(j), v[j]);
                }
                arr.endAnimate();
            } else {
                linearSet[i] = v;
                currentCount++;
                await sd.pause();
                grid.startAnimate();
                for (let j = 1; j <= n; j++) grid.value(I(i), I(j), v[j]);
                grid.endAnimate();
                arr.startAnimate().opacity(0).endAnimate().remove();
                return;
            }
            last = I(i);
        }
    }
    await sd.pause();
    arr.startAnimate().opacity(0).endAnimate().remove();
}

function I(i) {
    return n - i + 1;
}
