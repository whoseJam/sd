import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [3, 4, 2, 1, 4, 3, 1, 6, 6];
const K = 1;
const arr = new sd.Array(svg).start(1);
const ans = new sd.Array(svg).dy(80).start(1);

sd.init(() => {
    arr.pushArray(data);
    sd.Brace(arr).brace(1, data.length, "t").value("n");
    sd.Label(arr, `K=${K}`, "rc");
    arr.forEachElement((element, id) => {
        element.onClick(() => {
            if (ans.lastElement() && Math.abs(ans.lastElement().intValue() - element.intValue()) <= K) return;
            sd.inter(async () => {
                element.startAnimate().color(C.grey).endAnimate();
                ans.startAnimate().push(element.text()).endAnimate();
                sd.Label(ans.lastElement(), id, "tc", 10, 0);
            });
            element.onClick(null);
        });
    });
});

sd.main(async () => {});
