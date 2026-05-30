import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const s = new sd.Array(svg).pushArray("AAAAABAA").start(1);
const t = new sd.Array(svg).pushArray("AAAB").start(1);
const ps = sd.Pointer(s, "", "b", 3, 20, 3);
const pt = sd.Pointer(t, "", "b", 3, 20, 3);

sd.init(() => {
    t.y(80);
    sd.Label(s, "s");
    sd.Label(t, "t");
})

sd.main(async () => {
    for (let i = 1; i + t.length() - 1 <= s.length(); i++) {
        for (let j = 1; j <= t.length(); j++) {
            await sd.pause();
            if (j === 1 && i > 1) t.startAnimate().dx(40).endAnimate();
            ps.startAnimate().moveTo(i + j - 1).endAnimate();
            pt.after(0).startAnimate().moveTo(j).endAnimate();
            if (s.text(i + j - 1) === t.text(j)) {
                await sd.pause();
                s.startAnimate().color(i + j - 1, C.green).endAnimate();
                t.startAnimate().color(j, C.green).endAnimate();
            } else {
                await sd.pause();
                s.startAnimate().color(i + j - 1, C.red).endAnimate();
                t.startAnimate().color(j, C.red).endAnimate();
                break;
            }
        }
        await sd.pause();
        s.startAnimate().color(C.white).endAnimate();
        t.startAnimate().color(C.white).endAnimate();
    }    
})