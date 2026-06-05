import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [3, 2, 1, 4, 6, 1, 5, 4, 2, 1, 5, 3, 4, 2];
const arr = new sd.Array(svg);

sd.init(() => {
    arr.pushArray(data);
});

sd.main(async () => {
    const fI = sd.Focus(arr);
    const fJ = sd.Focus(arr);
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== 1) continue;
        for (let j = i + 1; j < data.length; j++) {
            if (data[j] !== 2) continue;
            await sd.pause();
            fI.startAnimate().focus(i).endAnimate();
            fJ.startAnimate().focus(j).endAnimate();
        }
    }
    await sd.pause();
    arr.startAnimate()
        .forEachElement(element => {
            if (element.intValue() === 1) element.color(C.blue);
            else if (element.intValue() === 2) element.color(C.green);
        })
        .endAnimate();
});
