import * as sd from "@/sd";

const intervals = [
    [1, 4],
    [3, 7],
    [5, 6],
    [7, 11],
    [2, 5],
    [4, 9],
    [6, 8],
    [8, 10],
];

const svg = sd.svg();
const C = sd.color();
let selectedCount = 0;
const countLabel = new sd.Text(svg, "");

function initIntervalsDisplay() {
    const rects = [];
    const yBase = 50;
    const rectHeight = 20;
    const spaceBetweenRects = 10;
    let mx = -Infinity;
    let x = Infinity;
    intervals.forEach(([left, right], index) => {
        let rank = 0;
        for (let i = 0; i < index; i++) {
            const prevRect = rects[i];
            const prevLeft = prevRect.left;
            const prevRight = prevRect.right;
            if (!(right < prevLeft || left > prevRight)) rank = Math.max(prevRect.rank + 1, rank);
        }
        const rect = new sd.Rect(svg);
        rect.rank = rank;
        rect.left = left;
        rect.right = right;
        rect.x(left * 50);
        rect.y(rect.rank * (rectHeight + spaceBetweenRects) + yBase);
        rect.width((right - left) * 50);
        rect.height(20);
        x = Math.min(x, rect.x());
        mx = Math.max(mx, rect.mx());
        rect.onClick(() => {
            sd.inter(async () => {
                if (rect.fill() === C.white) {
                    rect.startAnimate().color(C.blue).endAnimate();
                    selectedCount += right - left + 1;
                } else {
                    rect.startAnimate().color(C.white).endAnimate();
                    selectedCount -= right - left + 1;
                }
                countLabel.startAnimate();
                updateSelectedCountDisplay();
                countLabel.endAnimate();
            });
        });
        rects.push(rect);
    });
    countLabel.effect("center", () => {
        countLabel.cx((x + mx) / 2);
    });
    updateSelectedCountDisplay();
}

function updateSelectedCountDisplay() {
    countLabel.text(`覆盖长度: ${selectedCount}`);
}

sd.init(() => {
    intervals.sort((a, b) => {
        return a[0] - b[0];
    });
    initIntervalsDisplay();
});

sd.main(() => {});
