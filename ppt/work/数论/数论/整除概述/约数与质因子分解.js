import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const primes = [2, 3, 5, 7];
const arr1 = new sd.Array(svg).elementWidth(60).elementHeight(60).resize(primes.length);
const arr2 = new sd.Array(svg).elementWidth(60).elementHeight(60).resize(primes.length).dx(400);
const text1 = new sd.Text(svg, "1").fontSize(25);
const text2 = new sd.Text(svg, "1").fontSize(25);

sd.init(() => {
    arr1.forEachElement((element, i) => {
        element.value(0);
        sd.Label(element, primes[i], "tc", 20, 0);
        element.childAs(
            new sd.Button(element)
                .text("+")
                .width(30)
                .height(30)
                .onClick(() => {
                    sd.inter(async () => {
                        await update(arr1, i, text1, 1);
                    });
                }),
            R.aside("bl")
        );
        element.childAs(new sd.Button(element).text("-").width(30).height(30), R.aside("br"));
    });
    arr2.forEachElement((element, i) => {
        element.value(0);
        sd.Label(element, primes[i], "tc", 20, 0);
        element.childAs(
            new sd.Button(element)
                .text("+")
                .width(30)
                .height(30)
                .onClick(() => {
                    sd.inter(async () => {
                        await update(arr2, i, text2, 1);
                    });
                }),
            R.aside("bl")
        );
        element.childAs(new sd.Button(element).text("-").width(30).height(30), R.aside("br"));
    });
    sd.Aside(arr1, text1);
    sd.Aside(arr2, text2);
});

sd.main(async () => {});

async function update(arr, i, text, d) {
    arr.startAnimate();
    arr.text(i, arr.intValue(i) + d);
    arr.endAnimate();
    let ans = 1;
    for (let i = 0; i < primes.length; i++) {
        for (let j = 1; j <= arr.intValue(i); j++) ans *= primes[i];
    }
    text.after(0).startAnimate().text(ans).endAnimate();
}
