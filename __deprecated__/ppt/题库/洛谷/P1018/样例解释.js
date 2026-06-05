import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const digits = [2, 3, 4, 5, 4, 1, 5];
const k = 2;
const C = sd.color();
const arr = new sd.ValueArray(svg).elementWidth(100).y(50);
const resultLabel = new sd.Text(svg, "", "tc");
let multiplicationSigns = new Array(digits.length - 1).fill(false);
let result = 0;

function calculateResult() {
    let expression = digits[0].toString();
    for (let i = 0; i < digits.length - 1; i++) {
        if (multiplicationSigns[i]) expression += `*${digits[i + 1]}`;
        else expression += digits[i + 1];
    }
    result = eval(expression);
    return result;
}

sd.init(() => {
    digits.forEach((digit, index) => {
        const digitElement = new sd.Text(svg);
        digitElement.text(digit.toString());
        digitElement.color(C.black);
        digitElement.fontSize(20);
        digitElement.x(index * 80);
        arr.push(digitElement);
    });

    for (let i = 0; i < digits.length - 1; i++) {
        const multiplier = new sd.Text(svg, "×");
        const button = new sd.Button(div);
        button.text("×").width(40);
        button.cx((arr.element(i).cx() + arr.element(i + 1).cx()) / 2);
        button.y(100);
        multiplier.cx(button.cx()).cy(arr.cy()).opacity(0);
        button.onClick(() => {
            sd.inter(async () => {
                multiplicationSigns[i] = !multiplicationSigns[i];
                multiplier.startAnimate();
                if (multiplicationSigns[i]) multiplier.opacity(1);
                else multiplier.opacity(0);
                multiplier.endAnimate();
                resultLabel.startAnimate();
                resultLabel.text(calculateResult());
                resultLabel.endAnimate();
            });
        });
    }
    resultLabel
        .y(150)
        .effect("center", () => {
            resultLabel.cx(arr.cx());
        })
        .text(calculateResult());
});

sd.main(() => {});
