import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const C = sd.color();
const data = [1, 3, 2, 4, 5];
const arr = new sd.Array(svg).elementWidth(60);
const lInput = new sd.Slider(div).min(1).max(5).value(1);
const rInput = new sd.Slider(div).min(1).max(5).value(5);
const button = new sd.Button(div).text("查询");

sd.init(() => {
    arr.push(" ").pushArray(data);
    sd.Label(lInput, "左端点");
    sd.Label(rInput, "右端点");
    lInput.x(arr.x()).y(arr.my() + 20);
    rInput.x(arr.x()).y(lInput.my() + 20);
    button.x(arr.x()).y(rInput.my() + 20);
    button.onClick(() => {
        const start = lInput.value();
        const end = rInput.value();
        const l = Math.min(start, end);
        const r = Math.max(start, end);
        sd.inter(async () => {
            arr.startAnimate().color(l, r, C.blue).endAnimate();
            await sd.pause();
            arr.startAnimate().color(l, r, C.white).endAnimate();
        });
    });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    let ans = "";
    for (let i = 0; i <= data.length; i++) {
        if (i > 0) ans = ans + data[i - 1];
        arr.element(i).startAnimate().childAs("label", new sd.Text(svg, ans), R.aside("bc", 0)).endAnimate();
    }
});
