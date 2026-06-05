import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const stk = new sd.ValueStack(svg);
const [a, b] = [96, 36];

async function gcd(a, b, oa, ob) {
    if (a < b) [a, b] = [b, a];
    const math = stk.lastElement();
    if (!math) {
        stk.push(new sd.Math(stk, `gcd(${a},${b})`));
    } else {
        await sd.pause();
        stk.push(new sd.Math(stk));
        const lastMath = stk.lastElement();
        const mapping = [
            [math, "gcd(", "gcd("],
            [math, ")", ")"],
            [math, ",", ","],
        ];
        if (a === oa || b === ob) {
            mapping.push([math, oa, a]);
            mapping.push([math, ob, b]);
        } else if (a === ob || b === oa) {
            mapping.push([math, ob, a]);
            mapping.push([math, oa, b]);
        } else {
            mapping.push([math, oa, a]);
            mapping.push([math, ob, b]);
        }
        lastMath.after(0).startAnimate().text(`gcd(${a},${b})`, mapping).endAnimate();
        new sd.ZZLine(svg)
            .location("l")
            .bending(10)
            .source(V.add(math.pos("x", "cy"), [0, 5]))
            .target(V.add(lastMath.pos("x", "cy"), [0, -5]))
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
    }
    if (!b) {
        await sd.pause();
        const lastMath = stk.lastElement();
        lastMath.startAnimate().subtextColor(a, C.red).endAnimate();
        return a;
    }
    return await gcd(a % b, b, a, b);
}

sd.init(() => {});

sd.main(async () => {
    await gcd(a, b, a, b);
});
