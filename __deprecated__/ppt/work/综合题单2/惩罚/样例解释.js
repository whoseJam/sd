import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const array = new sd.BarArray(svg);
const gcdText = new sd.Text(svg);

sd.init(() => {
    const data = [6, 2, 4, 5, 3, 7, 5, 8, 1];
    array.pushArray(data).elementHeight(40).elementWidth(40);

    for (let i = 0; i < data.length; i++) {
        const plusButton = new sd.Button(svg).width(30);
        const minusButton = new sd.Button(svg).width(30);
        const text = new sd.Text(svg, data[i]);
        plusButton.text("+");
        minusButton.text("-");
        array.element(i).childAs(plusButton, (parent, child) => {
            child.cx(parent.cx()).y(parent.my() + 20);
        });
        array.element(i).childAs(minusButton, (parent, child) => {
            child.cx(parent.cx()).y(parent.my() + 50);
        });
        array.element(i).childAs(text, (parent, child) => {
            child.cx(parent.cx()).my(parent.my() - 10);
        });

        plusButton.onClick(() => {
            sd.inter(async () => {
                data[i]++;
                const g = data.reduce(gcd);
                gcdText.text(`GCD: ${g}`);
                text.text(data[i]);
                array.element(i).startAnimate().intValue(data[i]).endAnimate();
            });
        });

        minusButton.onClick(() => {
            sd.inter(async () => {
                data[i]--;
                const g = data.reduce(gcd);
                gcdText.text(`GCD: ${g}`);
                text.text(data[i]);
                array.element(i).startAnimate().intValue(data[i]).endAnimate();
            });
        });
    }

    const initialGcd = data.reduce(gcd);
    gcdText
        .text(`GCD: ${initialGcd}`)
        .cx(array.cx())
        .y(array.my() + 90);
});

sd.main(async () => {});
