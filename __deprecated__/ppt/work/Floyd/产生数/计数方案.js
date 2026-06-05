import * as sd from "@/sd";

const svg = sd.svg();
const number = "42142";
const arr = new sd.Array(svg).pushArray(number);
const be = {
    4: [4, 3],
    2: [2],
    1: [1, 8, 9],
};

sd.init(() => {});

sd.main(async () => {
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        const stk = new sd.ValueStack(svg)
            .cx(arr.element(i).cx())
            .y(arr.my() + 5)
            .elementHeight(20);
        const b = be[arr.intValue(i)];
        for (const _ of b) {
            stk.startAnimate().push(new sd.Text(stk, _).fontSize(15).opacity(0)).endAnimate();
        }
    }
});
