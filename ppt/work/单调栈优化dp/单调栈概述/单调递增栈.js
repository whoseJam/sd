import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [2, 4, 1, 3, 6, 5];
const arr1 = new sd.BarArray(svg).elementHeight(20);
const arr2 = new sd.Array(svg).y(20);

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        arr2.push(data[i]);
    }
})

sd.main(async () => {
    const p = sd.Pointer(arr2, "cur", "t", 10, 30);
    for (let i = 0; i < arr2.length(); i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        await sd.pause();
        arr1.startAnimate().push(data[i]).color(arr1.end(), C.blue).endAnimate();
        arr1.element(arr1.end()).idx = i;
        while (arr1.length() >= 2 && arr1.intValue(arr1.end()) <= arr1.intValue(arr1.end() - 1)) {
            await sd.pause();
            arr1.startAnimate().erase(arr1.end() - 1).endAnimate();
        }
        await sd.pause();
        arr1.startAnimate().color(arr1.end(), C.white).endAnimate();
        const lastIndex = arr1.length() >= 2 ? arr1.element(arr1.end() - 1).idx : -1;
        if (lastIndex !== -1) {
            const l = sd.Link(
                arr2.element(i),
                arr2.element(lastIndex),
                sd.Curve,
                "cx", "my",
                "cx", "my",
                (line) => line.bending(-0.5));
            l.startAnimate().pointStoT().endAnimate().arrow();
        }
    }
})