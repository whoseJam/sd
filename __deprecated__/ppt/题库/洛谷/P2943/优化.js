import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).start(1);
const checkpoints = [
    [10, C.blue],
    [7, C.red],
    [4, C.green],
    [2, C.yellow],
];

sd.init(() => {
    arr.resize(n);
    const colors = [];
    for (let i = 0; i < checkpoints.length; i++) {
        const checkpoint = checkpoints[i];
        colors.push(checkpoint[1]);
        arr.color(checkpoint[0], checkpoint[1]);
        const l = i + 1 < checkpoints.length ? checkpoints[i + 1][0] + 1 : 1;
        for (let j = checkpoint[0] - 1; j >= l; j--) {
            arr.color(j, colors[j % colors.length]);
        }
    }
});

sd.main(async () => {
    for (let i = 1; i < checkpoints.length; i++) {
        await sd.pause();
        const link = new sd.ZZLine(svg).bending(i * 30);
        link.source(arr.element(10).pos("cx", "my"));
        link.target(arr.element(checkpoints[i][0]).pos("cx", "my"));
        link.startAnimate()
            .pointStoT()
            .value(new sd.Math(svg, `$V=${i + 1}$`).fontSize(12), R.pointAtPathByRate(0.5, "cx", "my", 0, -3))
            .endAnimate()
            .arrow();
    }
    await sd.pause();
    const focus = sd.Focus(arr).stroke(C.textBlue);
    const stk = new sd.Stack(svg).resize(3).start(1).pos(arr.pos("x", "my", -60));
    sd.Label(stk, "$\\sqrt N$", "tc").fontSize(15);
    sd.Index(stk, "l");
    stk.opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 1; i < checkpoints.length; i++) {
        await sd.pause();
        focus
            .startAnimate()
            .focus(checkpoints[i][0] + 1, checkpoints[i - 1][0])
            .endAnimate();
        stk.startAnimate();
        if (i > 1) stk.color(i - 1, C.white);
        stk.color(i, C.textBlue);
        stk.endAnimate();
    }
});
