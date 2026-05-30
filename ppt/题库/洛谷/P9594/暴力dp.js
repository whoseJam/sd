import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const stk = new sd.ValueStack(svg).align("x").elementHeight(80);
const colorList = [C.red, C.green, C.blue];
const links = [
    { l: 2, r: 5, col: C.red },
    { l: 4, r: 8, col: C.green },
    { l: 3, r: 6, col: C.blue }
];

function colorToIndex(color) {
    for (let i = 0; i < colorList.length; i++) {
        if (colorList[i] === color) return i;
    }
}

sd.init(() => {
    stk.push(new sd.Array(svg).resize(10).start(1));
    for (let i = 1; i < colorList.length; i++) {
        stk.push(new sd.Array(svg).resize(10).start(1));
    }
    for (let i = 0; i < colorList.length; i++) {
        sd.Aside(stk.element(i), new sd.Rect(svg).color(colorList[i]).width(20).height(20));
    }
    sd.Index(stk.element(0), "t");
})

sd.main(async () => {
    const focus = sd.Focus(svg);
    const p = sd.Pointer(stk.element(0), "i", "b", "20", 25);
    for (let i = 1; i <= 10; i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        for (let j = 0; j < links.length; j++) {
            if (links[j].l === i) {
                const arr = stk.element(colorToIndex(links[j].col));
                const brace = sd.Brace(arr);
                await sd.pause();
                brace.startAnimate().brace(links[j].l, links[j].r, "b").endAnimate();
                await sd.pause();
                focus.startAnimate().focus(arr.element(1), arr.element(links[j].r)).endAnimate();
                await sd.pause();
                focus.startAnimate().focus(stk.element(0).element(1), stk.element(stk.end()).element(i - 1)).endAnimate();
                await sd.pause();
                focus.startAnimate().focus(arr.element(links[j].r + 1), arr.element(10)).endAnimate();
                await sd.pause();
                brace.startAnimate().opacity(0).endAnimate();
                focus.startAnimate().focus(null).endAnimate();
            }
        }
    }
})