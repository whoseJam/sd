import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.ValueTree(svg).width(1000).layerHeight(140).cx(600).y(50);
let tot = 1;

sd.init(() => {
    tree.root(1, makeGrid("283104765"));
});

sd.main(async () => {});

function makeGrid(str) {
    const myId = tot;
    const grid = new sd.Grid(tree).n(3).m(3);
    let x0, y0;
    grid.elementWidth(20);
    grid.elementHeight(20);
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            const idx = x * 3 + y;
            if (str[idx] == "0") {
                x0 = x;
                y0 = y;
                continue;
            }
            grid.value(x, y, str[idx]);
        }
    }
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    grid.onClick(() => {
        sd.inter(async () => {
            grid.onClick(null);
            tree.startAnimate().freeze();
            for (let i = 0; i < 4; i++) {
                const tx = x0 + dx[i];
                const ty = y0 + dy[i];
                if (0 <= tx && tx < 3 && 0 <= ty && ty < 3) {
                    let newStr = convertGridToStr(grid, x0, y0, tx, ty);
                    tree.newNode(++tot, makeGrid(newStr));
                    tree.newLink(myId, tot);
                }
            }
            tree.unfreeze().endAnimate();
        });
    });
    return grid;
}

function convertGridToStr(grid, x1, y1, x2, y2) {
    const charGrid = sd.make2d(3, 3);
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
            const tmp = grid.value(i, j);
            if (!tmp) charGrid[i][j] = "0";
            else charGrid[i][j] = grid.value(i, j).text();
        }
    const tmp = charGrid[x1][y1];
    charGrid[x1][y1] = charGrid[x2][y2];
    charGrid[x2][y2] = tmp;
    let str = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) str = str + charGrid[i][j];
    return str;
}
