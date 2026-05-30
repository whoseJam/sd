import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 12;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
const colorList = [C.green, C.blue, C.deepSkyBlue, C.orange, C.red];

sd.init(() => {
    sd.Index(grid, "t");
    sd.Index(grid, "l");
})

sd.main(async () => {
    grid.value(1, 1, 0);
    for (let Sum = 2; Sum <= n * 2; Sum++) {
        for (let i = 1; i <= Math.min(n, Sum - 1); i++) {
            let j = Sum - i;
            if (j > n) continue;
            if (i === j && i === 1) continue;
         
            const arr = [];
            for (let k = 1; k < i; k++) {
                arr.push(grid.intValue(k, i - k));
            }
            for (let k = 1; k < j; k++) {   
                arr.push(grid.intValue(j - k, k));
            }
            grid.value(i, j, Mex(arr));
        }
    }
    await sd.pause();
    grid.startAnimate();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (grid.intValue(i, j) === 0) continue;
            grid.color(i, j, colorList[grid.intValue(i, j) - 1]);
        }
    }
    grid.endAnimate();
})

function Mex(arr) {
    arr = [...new Set(arr)].sort((a, b) => a - b);
    for (let i = 0; i < arr.length; i++)
        if (arr[i] !== i) return i;
    return arr.length;
}