import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [2, 4, 1, 3, 6, 5, 4, 2, 5, 3, 1];
const arr1 = new sd.BarArray(svg).elementHeight(20);
const arr2 = new sd.Array(svg).y(20);
const popButton = new sd.Button(svg).text("删除");

popButton.onClick(() => {
    sd.inter(pop);
});

sd.init(() => {
    data.forEach(d => arr2.push(d));
    popButton.cy(arr2.cy()).mx(arr2.x() - 20);
});

sd.main(async () => {
    const p = sd.Pointer(arr2, "cur", "t", 10, 30);
    for (let i = 0; i < arr2.length(); i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        await sd.pause(sd.CONTINUE_STAGE);
        arr1.startAnimate().push(data[i]).color(arr1.end(), C.blue).endAnimate();
        arr1.element(arr1.end()).idx = i;
        while (arr1.length() >= 2 && arr1.intValue(arr1.end()) >= arr1.intValue(arr1.end() - 1)) {
            await sd.pause(sd.CONTINUE_STAGE);
            arr1.startAnimate()
                .erase(arr1.end() - 1)
                .endAnimate();
        }
        await sd.pause(sd.CONTINUE_STAGE);
        arr1.startAnimate().color(arr1.end(), C.white).endAnimate();
    }
});

async function pop() {
    if (arr1.length() > 0) arr1.startAnimate().erase(0).endAnimate();
}
