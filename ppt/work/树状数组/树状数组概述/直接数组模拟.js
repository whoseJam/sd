import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg);
const data = [2, 1, 3, 2, 1, 4, 3, 2];
const brace = sd.Brace(arr);

sd.init(() => {
    sd.Label(arr, "A数组", "lc");
    arr.pushArray(data);
})

sd.main(async () => {
    await Add(4, 2);
    await Query(2, 6);
})

async function Add(x, d) {
    await sd.pause();
    const element = arr.element(x);
    const text = new sd.Text(element, `+${d}`).cx(element.cx()).my(element.y());
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    text.startAnimate().cy(element.cy()).opacity(0).endAnimate().remove();
    element.after(300).startAnimate().value(data[x] = data[x] + d).endAnimate();
}

async function Query(l, r) {
    await sd.pause();
    let sum = 0;
    for (let i = l; i <= r; i++) sum += data[i];
    brace.startAnimate().brace(l, r, "t").value(sum).endAnimate();
    arr.startAnimate().color(l, r, C.orange).endAnimate();
    await sd.pause();
    brace.startAnimate().opacity(0).endAnimate();
    arr.startAnimate().color(C.white).endAnimate();
}