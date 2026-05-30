import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 20;
const arr = new sd.Array(svg).start(2).resize(n - 1);

sd.init(() => {
    arr.cx(600).cy(300);
    for (let i = 2; i <= n; i++) {
        arr.value(i, i);
        const e = arr.element(i);
        const stk = new sd.Stack(e);
        stk.elementWidth(20).elementHeight(20);
        e.childAs("stk", stk, R.aside("bc"));
    }
});

sd.main(async () => {
    const cur = sd.Pointer(arr, "i");
    const mul = sd.Pointer(arr, "p", "t").pointerGap(30);
    const kcur = sd.Pointer(arr, "ip", "t").pointerGap(30);
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        cur.startAnimate().moveTo(i).endAnimate();
        for (let j = 2; j <= i && j * i <= n; j++) {
            if (arr.element(j).child("stk").length() > 0) {
                continue;
            }
            await sd.pause();
            mul.startAnimate().moveTo(j).endAnimate();
            kcur.startAnimate()
                .moveTo(j * i)
                .endAnimate();
            await sd.pause();
            const stk = arr.element(j * i).child("stk");
            const size = stk.length();
            stk.startAnimate().push().color(size, C.blue).endAnimate();

            if (i % j == 0) break;
        }
        await sd.pause();
        mul.startAnimate().moveTo(null).endAnimate();
        kcur.startAnimate().moveTo(null).endAnimate();
    }
});
