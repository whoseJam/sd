/*
帮我实现如下场景：
有n个左右端点不尽相同的区间
每一个区间可以选择或者不选择
你可以用sd.Rect来绘制一个区间
当一个区间被点击选中时，它应该被涂蓝，当再次被点击时，取消选中
实时统计被选中的区间数量
*/

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

function getMex(mex) {
    mex = [...new Set(mex)];
    mex.sort();
    for (let i = 0; i < mex.length; i++) if (mex[i] !== i) return i;
    return mex.length;
}

function initIntervalsDisplay() {
    const rects = [];
    const yBase = 50;
    const rectHeight = 20;
    const spaceBetweenRects = 10;
    let mx = -Infinity;
    let x = Infinity;
    intervals.forEach(([left, right], index) => {
        const mex = [];
        for (let i = 0; i < index; i++) {
            const prevRect = rects[i];
            const prevLeft = prevRect.left;
            const prevRight = prevRect.right;
            if (!(right < prevLeft || left > prevRight)) mex.push(prevRect.rank);
        }
        const rect = new sd.Rect(svg);
        rect.rank = getMex(mex);
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
    initIntervalsDisplay();
});

sd.main(() => {});
