import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const length = 3;
const stk = new sd.Stack(svg).elementWidth(20 + length * 20).x(100).y(100);

const transToBinary = (x) => {
    let result = "";
    for (let i = 0; i < length; i++)
        result += String((x>>i)&1);
    return result.split("").reverse().join("");
}

for (let i = 0; i < (1<<length); i++) {
    stk.push(transToBinary(i));
}

main();

async function main() {
    const lines = { 1: [], 2: [], 3: [] };
    for (let l = 1; l <= length; l++) {
        await sd.pause();
        if (lines[l - 1]) {
            lines[l - 1].forEach(line => {
                line.startAnimate().stroke(C.grey).strokeDashArray([5, 5]).endAnimate().arrow(false);
            });
        }
        const gap = (1<<l-1);
        for (let i = 0; i < (1<<length); i++) {
            if (((i>>l-1)&1) === 0) {
                const next = i + gap;
                // 按位与卷积
                const line = sd.Link(
                    stk.element(next),
                    stk.element(i),
                    sd.Curve,
                    "mx", "cy",
                    "mx", "cy"
                ).bending(l * 0.3).startAnimate().pointStoT().endAnimate().arrow();
                lines[l].push(line);
            }
        }
    }
    await sd.pause();
}
