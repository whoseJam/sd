import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 3, 2],
    [5, 3, 5],
    [3, 4, 6],
    [3, 4, 1],
];
const a = new sd.Grid(svg);
const d = new sd.Grid(svg).dx(200);
const focus = sd.Focus(a);

sd.init(() => {
    sd.Label(a, "a");
    sd.Label(d, "d");
    for (let i = 0; i < data.length; i++)
        for (let j = 0; j < data[i].length; j++) {
            a.insert(i, j, data[i][j]);
            let delta = data[i][j];
            if (i >= 1) delta -= data[i - 1][j];
            if (j >= 1) delta -= data[i][j - 1];
            if (i >= 1 && j >= 1) delta += data[i - 1][j - 1];
            d.insert(i, j, delta);
        }
    d.forEachElement(element => element.opacity(0));
});

sd.main(async () => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            await sd.pause();
            focus.startAnimate().focus(i, j).endAnimate();
            d.startAnimate().opacity(i, j, 1).endAnimate();
        }
    }
    const focus_ = sd.Focus(d);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            await sd.pause();
            focus.startAnimate().focus(i, j).endAnimate();
            focus_.startAnimate().focus(0, 0, i, j).endAnimate();
        }
    }
});
