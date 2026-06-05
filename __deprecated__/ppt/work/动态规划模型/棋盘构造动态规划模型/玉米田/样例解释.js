import * as sd from "@/sd";

const strData = `
1 1 1 1 0
0 1 0 0 1
1 1 0 0 1
1 1 1 1 1
`;

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 4;
const m = 5;
const grid = new sd.Grid(svg).n(n).m(m);
const data = I.readIntMatrix(strData, n, m, false);
const plant = sd.make2d(n, m, 0);

sd.init(() => {
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            grid.value(i, j, data[i][j]);
            if (data[i][j] === 1) {
                grid.element(i, j).onClick(() => {
                    sd.inter(async () => {
                        if (plant[i][j] === 0) {
                            let flag = true;
                            for (let k = 0; k < 4; k++) {
                                const x = i + dx[k];
                                const y = j + dy[k];
                                if (x >= 0 && x < n && y >= 0 && y < m && plant[x][y]) {
                                    flag = false;
                                }
                            }
                            if (!flag) return;
                            plant[i][j] = 1;
                            grid.startAnimate().color(i, j, C.green).endAnimate();
                        } else {
                            plant[i][j] = 0;
                            grid.startAnimate().color(i, j, C.white).endAnimate();
                        }
                    });
                });
            }
        }
    }
});

sd.main(async () => {});
