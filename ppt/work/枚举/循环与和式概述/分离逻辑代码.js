import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "\\sum_{1\\le i\\le n}i[i是质数]").fontSize(30);
const block1 = new sd.Code(
    svg,
    `
int prim[M], tot;
Sieve(); // O(n) 线性筛
for (int i = 1; i <= tot; i++)
    if (prim[i] <= n) ans += prim[i];
`
);
const block2 = new sd.Code(
    svg,
    `
for (int i = 1; i <= n; i++)
    if (isPrime(i)) ans += i;
`
);

sd.init(() => {
    block1.cx(math.cx() - 200).y(math.my() + 100);
    block2.cx(math.cx() + 200).y(math.my() + 100);
});

sd.main(async () => {
    await sd.pause();
    const l1 = sd.Link(math, block1, sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate().arrow();
    const l2 = sd.Link(math, block2, sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    l1.startAnimate().value(new sd.Math(l1, "O(n)")).endAnimate();
    l2.startAnimate().value(new sd.Math(l2, "O(n\\sqrt{n})")).endAnimate();
});
