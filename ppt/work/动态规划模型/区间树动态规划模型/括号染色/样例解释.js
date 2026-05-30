import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colors = [C.white, C.red, C.textBlue];
const seq = "(())()";
const arr = new sd.Array(svg).pushArray(seq);

sd.init(() => {
    arr.forEachElement(element => {
        let tmp = 0;
        element.onClick(() => {
            tmp = (tmp + 1) % colors.length;
            sd.inter(async () => {
                element.startAnimate().color(colors[tmp]).endAnimate();
            });
        });
    });
});

sd.main(async () => {
    await sd.pause();
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] === "(") {
            const next = findNext(i);
            sd.Link(arr.element(i), arr.element(next), sd.ZZLine, "cx", "my", "cx", "my").startAnimate().pointStoT().endAnimate().arrow();
        }
    }
});

function findNext(s) {
    let top = 0;
    for (let i = s; i < seq.length; i++) {
        if (seq[i] === "(") top++;
        if (seq[i] === ")") top--;
        if (top === 0) return i;
    }
}
