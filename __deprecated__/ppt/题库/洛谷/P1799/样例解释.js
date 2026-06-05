/*
帮我实现如下场景：
有一个数组，数组中的元素都是整数
我们可以从数组中交互式标记某些数字被删除了
可以通过把某个数字涂灰，表示该数字已被删除
交互完成后，实时更新有多少个数字在自己的位置上（即有多少个k，满足k在删数后的数组的第k位）
*/

import * as sd from "@/sd";

// 初始化数组
const numberArray = [1, 3, 2, 4, 5];
const svg = sd.svg();
const C = sd.color();
const arrayComponent = new sd.Array(svg);
const countLabel = new sd.Label(arrayComponent, "", "bc");

function initArrayDisplay() {
    numberArray.forEach((num, index) => {
        const numberElement = new sd.Box(arrayComponent);
        numberElement.value(num);
        numberElement.color(C.white);
        numberElement.onClick(() => {
            sd.inter(async () => {
                if (numberElement.fill() !== C.grey) {
                    numberElement.startAnimate().color(C.grey).endAnimate();
                    numberArray[index] = null;
                } else {
                    numberElement.startAnimate().color(C.white).endAnimate();
                    numberArray[index] = num;
                }
                updateCountInPlace();
            });
        });
        arrayComponent.pushFromExistElement(numberElement);
    });
    updateCountInPlace(0);
}

function updateCountInPlace(time = 300) {
    let countInPlace = 0;
    let currentIndex = 0;
    arrayComponent.startAnimate(time);
    numberArray.forEach((num, index) => {
        if (num !== null) {
            currentIndex++;
            if (currentIndex === num) {
                countInPlace++;
                arrayComponent.color(index, C.blue);
            } else {
                arrayComponent.color(index, C.white);
            }
        }
    });
    arrayComponent.endAnimate();
    countLabel.text(`在原位的数字数量: ${countInPlace}`);
}

sd.init(() => {
    initArrayDisplay();
});

sd.main(() => {});
