import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const data = I.readIntMatrix(`
2 9 1 1
3 9 1 10
4 8 1 10
5 6 3 1
7 9 3 10`, 5, 4, false);
const mark = sd.make2d(20, 20);
const colorList = [C.grey, C.green, C.coral, C.blue];

function Max(arr, l, r) {
    let ans = 0;
    for (let i = l; i <= r; i++)
        ans = Math.max(ans, arr[i]);
    return ans;
}

function find(l, r) {
    for (let i = 0; i <= 20; i++) {
        if (Max(mark[i], l, r) > 0) continue;
        for (let j = l; j <= r; j++) mark[i][j] = 1;
        return i;
    }
}

function canSelect(i) {
    for (let j = 0; j < data.length; j++) {
        if (j === i) continue;
        if (!data[j][4]) continue; // not selected
        if (data[i][2] === data[j][2]) continue;
        if (data[i][1] < data[j][0] || data[j][1] < data[i][0]) continue;
        return false;
    }
    return true;
}

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        const l = data[i][0];
        const r = data[i][1];
        const mx = find(l, r);
        const c = data[i][2];
        const w = data[i][3];
        data[i].push(0);
        const box = new sd.Box(svg).x(l * 40).y(mx * 60).width((r - l + 1) * 40).value(`+${w}`).color(colorList[c]);
        box.onClick(() => {
            if (!data[i][4] && !canSelect(i)) return;
            data[i][4] ^= 1;
            if (data[i][4]) {
                box.strokeWidth(3).stroke(C.red);
            } else {
                box.strokeWidth(1).stroke(C.black);
            }
        })
    }
})

sd.main(async () => {

})