import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const e = [0, 5, 2, 4, 8, 6, 4, 1, 7, 5, 6, 1];
const k = 2;
const arr = new sd.Array(svg).start(1);
const que = new sd.Array(svg).y(80);

sd.init(() => {
    sd.Label(arr, "g-S数组");
    sd.Label(arr, `k=${k}`, "rc");
    for (let i = 1; i < e.length; i++) {
        arr.push(e[i]);
    }
    sd.Index(arr, "b");
})

sd.main(async () => {
    const brace = sd.Brace(arr);
    const p = sd.Pointer(arr, "cur", "b", 15, 30);
    for (let i = 1; i < e.length; i++) {
        await sd.pause();
        brace.startAnimate().brace(Math.max(1, i - k), i).endAnimate();
        p.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        que.startAnimate().push(e[i]).color(que.end(), C.blue).endAnimate();
        que.element(que.end()).childAs("pos", new sd.Text(svg, `pos=${i}`).fontSize(10), R.aside("tc", 2));
        que.element(que.end()).idx = i;
        
        while (que.length() >= 2 && i - que.element(0).idx > k) {
            await sd.pause();
            que.startAnimate().erase(0).endAnimate();
        }
        
        while (que.length() >= 2 && que.intValue(que.end()) >= que.intValue(que.end() - 1)) {
            await sd.pause();
            que.startAnimate().erase(que.end() - 1).endAnimate();
        }
        await sd.pause();
        que.startAnimate().color(que.end(), C.white).endAnimate();
    }
})