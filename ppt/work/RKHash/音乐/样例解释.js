import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();

// 定义输入字符串A和B
const A = [5, 6, 2, 10, 10, 7, 3, 2, 9];
const B = [1, 4, 4, 3, 2, 1];
const n = A.length;
const m = B.length;
const labelFontSize = 15;

// 离散化函数
function discretize(arr) {
    const uniqueChars = Array.from(new Set(arr)).sort((a, b) => a - b);
    const charMap = new Map();
    uniqueChars.forEach((char, index) => charMap.set(char, index));
    return arr.map(char => charMap.get(char));
}

function equal(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 将字符串B离散化
const discretizedB = discretize(B);

// 使用sd.Array存放字符串A
const arrA = new sd.Array(svg).pushArray(A);
const arrB = new sd.Array(svg).pushArray(B);

sd.init(() => {
    arrA.x(100).y(100);
    arrB.x(100).y(200);
});

sd.main(async () => {
    await sd.pause();
    arrB.forEachElement((element, index) => {
        element.startAnimate().childAs(new sd.Text(element, discretizedB[index]).fontSize(labelFontSize), R.aside("bc")).endAnimate();
    });

    const focus = sd.Focus(arrA);
    for (let i = 0; i <= n - m; i++) {
        await sd.pause();
        focus
            .startAnimate()
            .focus(i, i + m - 1)
            .endAnimate();
        await sd.pause();
        const subString = A.slice(i, i + m);
        const discretizedSubString = discretize(subString);
        for (let j = i; j < i + m; j++) {
            const element = arrA.element(j);
            element
                .startAnimate()
                .childAs("tmp", new sd.Text(element, discretizedSubString[j - i]).fontSize(labelFontSize), R.aside("bc"))
                .endAnimate();
        }

        if (equal(discretizedSubString, discretizedB)) {
            // 涂色操作
            await sd.pause();
            arrA.startAnimate()
                .color(i, i + m - 1, C.blue)
                .endAnimate();
            await sd.pause();
            arrA.startAnimate()
                .color(i, i + m - 1, C.white)
                .endAnimate();
        }

        await sd.pause();
        for (let j = i; j < i + m; j++) {
            const element = arrA.element(j);
            element.startAnimate().eraseChild("tmp").endAnimate();
        }
    }
});
