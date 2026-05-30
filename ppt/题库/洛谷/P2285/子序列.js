import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const arr = new sd.ValueArray(svg);
const moleAppearances = [
    [2, 1, 2],
    [4, 3, 1],
    [6, 0, 4],
    [1, 0, 0],
    [3, 1, 4],
    [5, 2, 3],
    [7, 3, 2],
    [8, 4, 1],
    [9, 4, 4],
];

sd.init(() => {
    moleAppearances.forEach(([time, row, col]) => {
        const mole = new sd.Circle(arr);
        arr.push(mole);
        mole.r(15).color(C.grey);
        mole.childAs(new sd.Text(mole, `T${time}`).fontSize(10), R.center());
        mole.time = time;
    });
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate()
        .sort((a, b) => {
            return a.time - b.time;
        })
        .endAnimate();
});
