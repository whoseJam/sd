import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg);
const ans = new sd.Array(svg).y(60);
const data = "()))((()))((()";
const p = sd.Pointer(arr, "i", "b", 5, 30, 5);

sd.init(() => {
    arr.pushArray(data);
})

sd.main(async () => {
    let top = 0;
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        ans.after(p);
        if (arr.text(i) === "(") {
            top++;
            ans.startAnimate().push("(").endAnimate();
        } else if (arr.text(i) === ")") {
            if (top > 0) {
                top--;
                ans.startAnimate().pop().endAnimate();
            } else {
                ans.startAnimate().push(")").endAnimate();
            }
        }
    }
    await sd.pause();
    p.startAnimate().moveTo(null).endAnimate();
})