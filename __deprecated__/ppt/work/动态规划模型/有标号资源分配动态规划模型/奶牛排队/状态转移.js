import * as sd from "@/sd";
import { BinaryString } from "../_/BinaryString";

const svg = sd.svg();
const C = sd.color();
const data = [3, 4, 2, 1, 4, 3, 1, 6, 6];
const K = 1;
const n = data.length;
const mask = [1, 4, 2, 8];
const posJ = 3;
const posI = mask[mask.length - 1];
const arr = new sd.Array(svg).start(1);
const ans = new sd.Array(svg).dy(80).start(1);
const status = new BinaryString(svg, n);

sd.init(() => {
    arr.pushArray(data);
    sd.Label(arr, `K=${K}`, "rc");
    status.cx(arr.cx()).y(arr.my() + 120);
    mask.forEach(i => {
        status.value(i, 1);
        arr.color(i, C.grey);
        ans.push(arr.text(i));
        sd.Label(ans.lastElement(), i, "tc", 10, 0);
    });
});

sd.main(async () => {
    const focus = sd.Focus(arr);
    await sd.pause();
    sd.Pointer(arr, "i", "b").startAnimate().moveTo(posI).endAnimate();
    focus.startAnimate().focus(posI).endAnimate();
    await sd.pause();
    sd.Pointer(arr, "j", "b").startAnimate().moveTo(posJ).endAnimate();
    await sd.pause();
    ans.startAnimate().push(arr.text(posJ)).endAnimate();
    sd.Label(ans.lastElement(), posJ, "tc", 10, 0);
    await sd.pause();
    status.startAnimate().value(posJ, 1).endAnimate();
    focus.startAnimate().focus(posJ).endAnimate();
    arr.startAnimate().color(posJ, C.grey).endAnimate();
});
