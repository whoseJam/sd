import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const str = "aabbabaabaaabba";
const substr = "aab";
const arr = new sd.Array(svg).pushArray(str);

sd.init(() => {
    sd.Index(arr, "t");
});

sd.main(async () => {
    await sd.pause();
    const text = new sd.Text(svg, substr)
        .cx(arr.cx())
        .y(arr.my() + 40)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();

    await sd.pause();
    arr.startAnimate();
    findAllRightPosition(str, substr).forEach(pos => {
        arr.color(pos, C.red);
        sd.Brace(arr)
            .brace(pos - substr.length + 1, pos, "b")
            .startAnimate()
            .pointTtoS()
            .endAnimate();
    });
    arr.endAnimate();

    await sd.pause();
    text.startAnimate()
        .mx(arr.cx() - 20)
        .endAnimate();
    const endpos = new sd.Math(svg, "endpos(aab)=\\{2,8,12\\}")
        .x(arr.cx() + 20)
        .cy(text.cy())
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
});

function findAllRightPosition(str, substr) {
    const pos = [];
    for (let i = 0; i + substr.length <= str.length; i++) {
        if (str.slice(i, i + substr.length) === substr) {
            pos.push(i + substr.length - 1);
        }
    }
    return pos;
}
