import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 5;
const arrA = new sd.Array(svg).start(1);
const arrB = new sd.Array(svg).start(1).y(80).resize(n);
const fontSize = 18;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arrA.push(new sd.Math(arrA, `\\frac{1}{${i}^2}`));
        arrB.element(i).value(new sd.Math(arrB, `q_{${i}}`).fontSize(fontSize), R.center());
    }
    arrA.push("...");
    arrA.push(new sd.Math(arrA, "\\frac{1}{(j-1)^2}"));
    arrA.push(new sd.Math(arrA, "\\frac{1}{j^2}"));

    arrB.push("...");
    arrB.push();
    arrB.lastElement().value(new sd.Math(arrB, "q_{j-1}").fontSize(fontSize), R.center());
    arrB.push();
    arrB.lastElement().value(new sd.Math(arrB, "q_{j}").fontSize(fontSize), R.center());
});

sd.main(async () => {
    await sd.pause();
});
