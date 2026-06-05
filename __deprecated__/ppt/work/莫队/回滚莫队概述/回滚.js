import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 20;
const arr = new sd.Array(svg).resize(n).start(1);
const blockR = sd.make1d(n + 5);
const B = 4;
const colorList = [C.gradient(C.white, C.deepSkyBlue, 0, 2)(1), C.deepSkyBlue];
const data = [
    [3, 5],
    [2, 12],
    [6, 8],
    [1, 9],
    [7, 16],
    [12, 19],
    [11, 14],
    [10, 18]
]

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        const block = Math.floor((i - 1) / B);
        const idx = block & 1;
        arr.color(i, colorList[idx]);
        blockR[block] = i;
    }
})

sd.main(async () => {
    await sd.pause();
    for (let i = 0; i < data.length; i++) {
        const brace = sd.Brace(arr).brace(data[i][0], data[i][1], "t", i * 15 + 10).opacity(0).startAnimate().opacity(1).endAnimate();
        data[i].push(brace);
    }
    await sd.pause();
    data.sort((a, b) => {
        const blockA = Math.floor((a[0] - 1) / B);
        const blockB = Math.floor((b[0] - 1) / B);
        if (blockA != blockB) return blockA - blockB;
        return a[1] - b[1];
    });
    for (let i = 0; i < data.length; i++) {
        data[i][2].startAnimate().braceGap(i * 15 + 10).endAnimate();
    }
    await sd.pause();
    const l = sd.Pointer(arr, "l", "t", 10, 30);
    const r = sd.Pointer(arr, "r", "t", 10, 30);
    const focus = sd.Focus(arr);
    let lastBlock = 0;
    for (let i = 0; i < data.length; i++) {
        const block = Math.floor((data[i][0] - 1) / B);
        const blockk = Math.floor((data[i][1] - 1) / B);
        
        if (block !== lastBlock) {
            await sd.pause();
            focus.startAnimate().focus(null).endAnimate();
            r.startAnimate().opacity(0).endAnimate();
            lastBlock = block;
        }

        if (block === blockk) {
            await sd.pause();
            sd.Brace(arr).brace(data[i][0], data[i][1], "t", i * 15 + 10).stroke(C.red).strokeWidth(2).startAnimate().pointStoT().endAnimate();
            continue;
        }

        if (focus.opacity() === 0) {
            await sd.pause();
            focus.startAnimate().focus(blockR[block] + 1).endAnimate();
            r.startAnimate().moveTo(blockR[block] + 1).endAnimate();
            if (blockR[block] + 1 < data[i][1]) {
                await sd.pause();
                focus.startAnimate().focus(blockR[block] + 1, data[i][1]).endAnimate();
                r.startAnimate().moveTo(data[i][1]).endAnimate();
            }
        } else {
            await sd.pause();
            focus.startAnimate().focus(blockR[block] + 1, data[i][1]).endAnimate();
            r.startAnimate().moveTo(data[i][1]).endAnimate();
        }

        await sd.pause();
        l.startAnimate().moveTo(blockR[block]).endAnimate();

        await sd.pause();
        l.startAnimate().moveTo(data[i][0]).endAnimate();

        await sd.pause();
        sd.Brace(arr).brace(data[i][0], data[i][1], "t", i * 15 + 10).stroke(C.red).strokeWidth(2).startAnimate().pointStoT().endAnimate();

        await sd.pause();
        l.startAnimate().opacity(0).endAnimate();
    }
})