import * as sd from "@/sd";

const numberArray = [1, 3, 2, 4, 5];
const svg = sd.svg();
const C = sd.color();
const arrayComponent = new sd.Array(svg);
const countLabel = new sd.Label(arrayComponent, "", "bc");

function initArrayDisplay() {
    numberArray.forEach((num, index) => {
        const numberElement = new sd.Box(arrayComponent);
        numberElement.value(num);
        numberElement.color(C.grey);
        numberArray[index] = null;
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
