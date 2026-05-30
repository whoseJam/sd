import * as sd from "@/sd";

const svg = sd.svg();
const data = [5, 1, 3, 2, 4, 1, 3];
const arr = new sd.BarArray(svg);

sd.init(() => {
    data.forEach(d => arr.push(d));
})

sd.main(async () => {
    function findLeft(idx) {
        for (let i = idx - 1; i >= 0; i--)
            if (data[i] > data[idx]) return i;
        return -1;
    }
    function findRight(idx) {
        for (let i = idx + 1; i < data.length; i++)
            if (data[i] > data[idx]) return i;
        return -1;
    }
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        const l = findLeft(i);
        const r = findRight(i);
        const links = [];
        if (l !== -1) {
            links.push(sd.Link(arr.element(i), arr.element(l), sd.Curve, "cx", "my", "cx", "my", (line) => line.bending(-0.5)).startAnimate().pointStoT().endAnimate().arrow());
        }
        if (r !== -1) {
            links.push(sd.Link(arr.element(i), arr.element(r), sd.Curve, "cx", "my", "cx", "my", (line) => line.bending(0.5)).startAnimate().pointStoT().endAnimate().arrow());
        }
        await sd.pause();
        links.forEach(link => {
            link.startAnimate().fadeStoT().endAnimate().arrow(null);
        })
    }
})