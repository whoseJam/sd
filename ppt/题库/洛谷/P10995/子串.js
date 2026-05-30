import * as sd from "@/sd";

const svg = sd.svg();
const s = "12345";
const arr = new sd.Array(svg).elementWidth(60);

sd.init(() => {
    arr.pushArray(s);
})

sd.main(async() => {
    for (let i = 0; i < s.length; i++) {
        await sd.pause();
        makeSubString(i);
    }
})

function makeSubString(l) {
    let result = [];
    for (let i = l; i < s.length; i++) {
        let tmp = "";
        for (let j = l; j <= i; j++) tmp = tmp + s[j];
        result.push(new sd.Text(svg, tmp));
    }
    const x = arr.element(l).x();
    let y = arr.element(l).my() + 10;
    for (let i = 0; i < result.length; i++) {
        result[i].x(x).y(y).opacity(0).startAnimate().opacity(1).endAnimate();
        y += 20;
    }
}