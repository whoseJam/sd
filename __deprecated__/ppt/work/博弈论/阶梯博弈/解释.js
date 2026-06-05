import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [0, 1, 2, 2, 1];
const arrs = [];
const W = 120;

function CX(i) {
    return i * W + (W / 2) * 3;
}

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        const rect = new sd.Rect(svg)
            .height(i * 60)
            .width(W)
            .x(i * W + W)
            .my(0);
        const arr = new sd.ValueArray(svg)
            .elementWidth(22)
            .elementHeight(22)
            .my(rect.y() - 2);
        arrs.push(arr);
        for (let j = 0; j < data[i]; j++) {
            let curIndex = i;
            const circ = new sd.Circle(svg).r(10).color(C.grey);
            arr.push(
                circ.onClick(() => {
                    sd.inter(async () => {
                        if (curIndex === 0) return;
                        let curRank = 0;
                        for (let k = 0; k < arrs[curIndex].length(); k++) {
                            if (arrs[curIndex].element(k) === circ) {
                                curRank = k;
                                break;
                            }
                        }
                        arrs[curIndex].startAnimate();
                        arrs[curIndex].dropElement(curRank);
                        arrs[curIndex].cx(CX(curIndex));
                        arrs[curIndex].endAnimate();
                        curRank = arrs[curIndex - 1].length();
                        curIndex--;
                        arrs[curIndex].startAnimate().pushFromExistElement(circ).cx(CX(curIndex)).endAnimate();
                    });
                })
            );
        }
        arr.cx(CX(i));
    }
});

sd.main(async () => {});
