import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const T = 500;

sd.main(Test1);

async function TestMatchNestedSum() {
    const text = new sd.Math(svg, "\\sum_{i=1}^3a_i\\sum_{j=1}^3b_j").x(100).y(100);
    await sd.pause();
    text.startAnimate().subtextColor("\\sum_{i=1}^3a_i", C.red).endAnimate();
}

async function TestSetSourceColor() {
    const a = new sd.Math(svg, "a").x(100).y(100).fontSize(50);
    await sd.pause();
    a.startAnimate()
        .text("ac", [["", "c"]])
        .subtextColor("c", C.textBlue)
        .endAnimate();
}

async function TestMerge() {
    const a = new sd.Math(svg, "a").x(100).y(100);
    const b = new sd.Math(svg, "b").x(200).y(100);
    const c = new sd.Math(svg).x(150).y(200);
    await sd.pause();
    c.startAnimate()
        .text(
            "c",
            [
                { source: a, target: { subtext: "c", i: 0 } },
                { source: b, target: { subtext: "c", i: 0 } },
            ],
            false
        )
        .endAnimate();
}

async function TestSigmaSubtextTransform() {
    const text = new sd.Math(svg, "\\sum_{\\begin{aligned}2\\le & i\\le n\\\\i\\; is &\\; even \\end{aligned} }i").x(100).y(100);
    await sd.pause();
    text.startAnimate().subtextColor("\\begin{aligned}2\\le & i\\le \\end{aligned}", C.red).endAnimate();
}

async function TestTwoDigitColorTransform() {
    const m = new sd.Math(svg, "12").subtextColor("12", C.red);
    await sd.pause();
    m.startAnimate().text("a").endAnimate();
}

async function TestColorTransformThenCover() {
    const m1 = new sd.Math(svg, "1").x(100).y(100);
    const m2 = new sd.Math(svg, "2").x(100).y(200);
    await sd.pause();
    const math = new sd.Math(svg).x(200).y(100);
    math.startAnimate()
        .text("12", [
            [m1, "1"],
            [m2, "2"],
        ])
        .endAnimate();
    await sd.pause();
    math.startAnimate().color(C.textBlue).endAnimate();
}

async function TestDigitFade() {
    const math = new sd.Math(svg, "123456");
    await sd.pause();
    math.startAnimate().text("12345", { 12345: 12345 }).endAnimate();
    await sd.pause();
    math.startAnimate().text("1234", { 1234: 1234 }).endAnimate();
    await sd.pause();
    math.startAnimate().text("123", { 123: 123 }).endAnimate();
}

async function TestDigitSplit() {
    const math = new sd.Math(svg, "a^{123456}").x(100).y(100).fontSize(50);
    await sd.pause();
    math.subtextColor("345", C.red);
}

async function TestInstantSwitch() {
    const math = new sd.Math(svg, "1").x(100).y(100).fontSize(50);
    await sd.pause();
    math.text("?");
}

async function TestFibnacci() {
    const fn1 = new sd.Math(svg, "f_{n-1}").x(100).y(100).fontSize(40);
    const fn2 = new sd.Math(svg, "f_{n-2}").x(100).y(200).fontSize(40);
    await sd.pause();
    const sum = new sd.Math(svg)
        .x(500)
        .y(100)
        .fontSize(60)
        .startAnimate()
        .text("f_{n-1}+f_{n-2}", [
            [fn1, "f_{n-1}"],
            [fn2, "f_{n-2}"],
        ])
        .endAnimate();
}

async function TestColorCover() {
    const math = new sd.Math(svg, "\\sum_{i=1}^n(a+b)^2").x(100).y(100).fontSize(50);
    await sd.pause();
    math.startAnimate().subtextColor("a+b", C.orange).endAnimate();
    await sd.pause();
    math.startAnimate().subtextColor("i=1", C.grey).endAnimate();
    await sd.pause();
    math.startAnimate().subtextColor("(a+b)^2", C.textBlue).endAnimate();
    await sd.pause();
    math.startAnimate().subtextColor("2", C.red).endAnimate();
}

async function Test11() {
    const m1 = new sd.Math(svg, "1").x(100).y(100).color(C.textBlue).fontSize(50);
    const m2 = new sd.Math(svg, "2").x(100).y(200).fontSize(50);
    const m3 = new sd.Math(svg, "3").x(200).y(100).fontSize(50);
    const m4 = new sd.Math(svg, "4").x(200).y(200).fontSize(50);
    await sd.pause();
    const math = new sd.Math(svg)
        .x(400)
        .y(100)
        .startAnimate()
        .text("1+2+3+4", [
            [m1, "1", "1"],
            [m2, "2"],
            [m3, "3"],
            [m4, "4"],
        ])
        .endAnimate();
}

async function Test10() {
    const data = [
        ["?", "?"],
        ["?", "?"],
    ];
    function matrix(data) {
        let ans = "\\begin{pmatrix}";
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                ans += String(data[i][j]);
                if (j !== data[i].length - 1) ans += " &";
                else ans += "\\\\";
            }
        }
        ans += "\\end{pmatrix}";
        return ans;
    }
    const math = new sd.Math(svg, matrix(data)).x(100).y(100);
    const value = new sd.Math(svg, "8").x(100).y(300);
    await sd.pause();
    data[0][0] = 8;
    math.startAnimate()
        .text(matrix(data), [[value, "8"]])
        .endAnimate();
}

async function Test9() {
    const math = new sd.Math(svg, "(x_i,y_i)").cx(100).cy(100);
    await sd.pause();
    math.startAnimate(T).text("(1,3)", { x_i: 1, y_i: 3 }).endAnimate();
    await sd.pause();
    const sum = new sd.Math(svg).cx(100).cy(200);
    sum.startAnimate(T)
        .text("\\sum_{i=1}^3 i", [
            [math, "1", "1"],
            [math, "3", "3"],
        ])
        .endAnimate();
    await sd.pause();
    sum.startAnimate(T).text("1+2+3").endAnimate();
    await sd.pause();
    const two = new sd.Math(svg, "a+b+c").opacity(0).cx(200).cy(150).startAnimate().opacity(1);
    await sd.pause();
    two.startAnimate(T)
        .text("a^1+b^2+c^3", [
            [sum, "1", "1"],
            [sum, "2", "2"],
            [sum, "3", "3"],
        ])
        .endAnimate();
    await sd.pause();
    two.startAnimate(T).text("a^3+b^1+c^2", { 1: 1, 2: 2, 3: 3 }).endAnimate();
    await sd.pause();
    two.startAnimate(T).text("c^3+a^1+b^2").endAnimate();
    await sd.pause();
    two.startAnimate(T).text("\\mu").fontSize(40).endAnimate();
    await sd.pause();
    sum.startAnimate(T).text("\\varphi").fontSize(40).endAnimate();
    await sd.pause();
    math.startAnimate().text("\\sigma").fontSize(40).endAnimate();
    // await sd.pause();
    // const final = new sd.Math(svg)
    //     .cx(125)
    //     .cy(125)
    //     .startAnimate(T)
    //     .text("{\\infty}", [
    //         [two, "\\infty"],
    //         [sum, "\\infty"],
    //         [math, "\\infty"],
    //     ])
    //     .endAnimate();
}

async function Test8() {
    const m1 = new sd.Math(svg, "a").x(700).y(100);
    const m2 = new sd.Math(svg, "b").x(800).y(100);
    const m3 = new sd.Math(svg, "c").x(900).y(100);
    const m = new sd.Math(svg, "ttt").x(800).y(200);
    await sd.pause();
    m.startAnimate(T)
        .text("\\sum_{i=1}^{n}{a+b}", [
            [m1, "i=1"],
            [m2, "n"],
            [m3, "a+b"],
        ])
        .fontSize(50)
        .x(100)
        .subtextColor("a+b", C.textBlue)
        .endAnimate();
}

async function Test7() {
    const math = new sd.Math(svg, "\\sum_{i=1}^n(a+b)^2").fontSize(50).x(100).y(100);
    await sd.pause();
    math.startAnimate();
    math.subtextColor("i=1", C.textBlue);
    math.subtextColor("n", C.red);
    math.subtextColor("(a+b)^2", C.purple);
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.text("{a+b}={c}", { "a+b": "a+b" });
    math.subtextColor("a+b", C.purple);
    math.endAnimate();
}

async function Test6() {
    const n = 15;
    const maths = [];
    for (let i = 1; i <= n; i++) {
        maths.push(
            new sd.Math(svg)
                .text(`\\frac{${i}}{${n}}`)
                .cx(500 + i * 40)
                .y(300)
        );
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const gcd = getGCD(i, n);
        const mapping = [
            [i, i / gcd],
            [n, n / gcd],
        ];
        maths[i - 1]
            .startAnimate(T)
            .text(`\\frac{${i / gcd}}{${n / gcd}}`, mapping)
            .cx(500 + i * 40)
            .endAnimate();
    }
}

async function Test5() {
    const math = new sd.Math(svg, "\\sum_{i=1}^{10}{i}").x(500).y(200);
    await sd.pause();
    math.startAnimate(T).text("1+2+3+4+5+6+7+8+9+10", { "i=1": "1+2+3+4+5+6+7+8+9+10" }).endAnimate();
}

async function Test4() {
    const math = new sd.Math(svg, "\\frac a b=c").fontSize(40).x(500).y(100);
    await sd.pause();
    math.startAnimate(T).text("a=bc", { "a": "a", "b": "b", "c": "c", "=": "=" }).endAnimate();
}

async function Test3() {
    const math = new sd.Math(svg, "a^2+b^2=c^2").fontSize(40).x(100).y(300);
    await sd.pause();
    math.startAnimate(T).text("a^2=c^2-b^2", { "a^2": "a^2", "b^2": "b^2", "c^2": "c^2", "=": "=" }).endAnimate();
}

async function Test2() {
    const math = new sd.Math(svg, "a^2+b^2=c^2").fontSize(180).x(100).y(200);
    const rect = new sd.Rect(svg).fillOpacity(0).x(math.x()).y(math.y()).width(math.width()).height(math.height());
    await sd.pause();
    math.startAnimate(T).text("a^2=c^2-b^2").endAnimate();
}

async function Test1() {
    const math = new sd.Math(svg, "a^2b^2c^2d^2").x(100).y(100).fontSize(100);
    const mx = math.mx();
    await sd.pause();
    math.startAnimate().subtextColorAll("b^2", C.red).endAnimate();
    await sd.pause();
    math.startAnimate().color(C.textBlue).subtextColorAll("a^2", C.orange).fontSize(50).mx(mx).subtextColorLast("2", C.pureBlue).endAnimate();
    await sd.pause();
    math.startAnimate().text("2a").color(C.textBlue).endAnimate();
    await sd.pause();
    math.startAnimate().text("3q").fontSize(180).endAnimate();
}

async function TestConsecutiveSubtextColor() {
    const math = new sd.Math(svg, "a^2b^2c^2d^2").x(100).y(100).fontSize(100);
    await sd.pause();
    math.startAnimate().subtextColorAll("b^2", C.red).color(C.textBlue).subtextColorAll("a^2", C.orange).subtextColorLast("2", C.pureBlue).endAnimate();
}

async function TestConsecutiveTransform() {
    const text = new sd.Math(svg, "A").x(100).y(100).fontSize(100);
    await sd.pause();
    text.startAnimate(1000).text("B").endAnimate();
    text.startAnimate(1000).text("C").endAnimate();
}

async function TestSubtextColorWithTransform() {
    const text1 = new sd.Math(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Math(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Math(svg, "hello").x(100).y(300).fontSize(50).color(C.textBlue);
    const text4 = new sd.Math(svg, "hello").x(100).y(400).fontSize(50).subtextColor("ll", C.textBlue);
    const text5 = new sd.Math(svg, "hello").x(100).y(500).fontSize(50);
    await sd.pause();
    text1.startAnimate().text("world", { ll: "rl" }).subtextColor("rl", C.textBlue).endAnimate();
    text2
        .startAnimate()
        .text("world", [[text3, "d"]])
        .subtextColor("d", C.textBlue)
        .endAnimate();
    text4.startAnimate().text("world", { ll: "l" }).endAnimate();
    text5.startAnimate().subtextColor("ll", C.textBlue).text("world", { ll: "l" }).endAnimate();
}

async function TestTransformWithSubtextColor() {
    const text1 = new sd.Math(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Math(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Math(svg, "hello").x(100).y(300).fontSize(50);
    await sd.pause();
    text1.startAnimate().text("world").endAnimate();
    text2.startAnimate().text("world").subtextColor("orl", C.red).endAnimate();
    text3.startAnimate().subtextColor("ll", C.red).endAnimate();
}

async function TestSubtextColorWithFontSize() {
    const text1 = new sd.Math(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Math(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Math(svg, "hello").x(100).y(300).fontSize(50);
    await sd.pause();
    text1.startAnimate().fontSize(80).endAnimate();
    text2.startAnimate().subtextColor("ll", C.red).fontSize(80).endAnimate();
    text3.startAnimate().fontSize(80).subtextColor("ll", C.red).endAnimate();
}

async function TestSubtextColorWithPosition() {
    const text1 = new sd.Math(svg, "hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Math(svg, "hello").x(100).y(200).fontSize(50);
    const text3 = new sd.Math(svg, "hello").x(100).y(300).fontSize(50);
    await sd.pause();
    text1.startAnimate().x(200).endAnimate();
    text2.startAnimate().subtextColor("ll", C.red).x(200).endAnimate();
    text3.startAnimate().x(200).subtextColor("ll", C.red).endAnimate();
}

async function TestSubtextColor() {
    const text = new sd.Math(svg).fontSize(100).text("abcabcabc");
    await sd.pause();
    text.startAnimate().subtextColorAll("bc", C.red).endAnimate();
    await sd.pause();
    text.startAnimate().subtextColorAll("c", C.textBlue).endAnimate();
    await sd.pause();
    text.startAnimate().fill(C.purple).endAnimate();
    await sd.pause();
    text.startAnimate().fill(C.grey).endAnimate();
}

async function TestTransformWithFontSize() {
    const text1 = new sd.Math(svg).text("hello").x(100).y(100).fontSize(50);
    const text2 = new sd.Math(svg).text("world").x(100).y(200).fontSize(50);
    const text3 = new sd.Math(svg).text("world").x(100).y(300).fontSize(50);
    await sd.pause();
    text1.startAnimate().fontSize(80).endAnimate();
    text2.startAnimate().fontSize(80).text("hello").endAnimate();
    text3.startAnimate().text("hello").fontSize(80).endAnimate();
}

async function TestTransformWithColor() {
    const math1 = new sd.Math(svg).text("hello").x(100).y(100).fontSize(50);
    const math2 = new sd.Math(svg).text("world").x(100).y(200).fontSize(50);
    const math3 = new sd.Math(svg).text("world").x(100).y(300).fontSize(50);
    await sd.pause();
    math1.startAnimate().fill(C.red).endAnimate();
    math2.startAnimate().fill(C.red).text("hello").endAnimate();
    math3.startAnimate().text("hello").fill(C.red).endAnimate();
}

async function TestTrasnformWithPosition() {
    const math1 = new sd.Math(svg).text("hello").x(100).y(100).fontSize(50);
    const math2 = new sd.Math(svg).text("world").x(100).y(200).fontSize(50);
    const math3 = new sd.Math(svg).text("world").x(100).y(300).fontSize(50);
    await sd.pause();
    math1.startAnimate().text("world").x(200).endAnimate();
    math2.startAnimate().x(200).endAnimate();
    math3.startAnimate().x(200).text("hello").endAnimate();
}

async function TestTransform() {
    const math = new sd.Math(svg, "hello").x(100).y(100).fontSize(30);
    await sd.pause();
    math.startAnimate().text("world").endAnimate();
}

function getGCD(a, b) {
    if (!b) return a;
    return getGCD(b, a % b);
}
