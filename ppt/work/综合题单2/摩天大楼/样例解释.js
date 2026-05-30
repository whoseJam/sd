import * as sd from "@/sd";

const svg = sd.svg();
const barArray = new sd.BarArray(svg);
const text = new sd.Text(svg);

sd.init(() => {
    barArray.pushArray([6, 2, 5, 1, 4, 3]);
});

sd.main(async () => {
    await sd.pause();
    barArray
        .startAnimate()
        .sort((a, b) => Math.random() - 0.5)
        .endAnimate();
    let sum = 0;
    for (let i = 1; i < barArray.length(); i++) {
        const prevValue = barArray.intValue(i - 1);
        const currValue = barArray.intValue(i);
        sum += Math.abs(currValue - prevValue);
    }
    text.opacity(0).text(`Sum of absolute differences: ${sum}`).cx(barArray.cx()).startAnimate().opacity(1).endAnimate();
});
