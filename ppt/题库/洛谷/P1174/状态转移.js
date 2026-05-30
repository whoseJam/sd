import * as sd from "@/sd";

class Brick {
    constructor(score, isSpecial = false) {
        this.score = score;
        this.isSpecial = isSpecial;
    }
}
class Column {
    constructor(bricks) {
        this.bricks = bricks;
    }
}

const columnConfigs = [
    { brickScores: [10, 20, 15], specialIndices: [1] },
    { brickScores: [5, 8], specialIndices: [] },
    { brickScores: [25, 30, 35, 40], specialIndices: [2] },
    { brickScores: [12], specialIndices: [] },
];

const columns = columnConfigs.map(config => {
    const bricks = config.brickScores.map((score, index) => {
        return new Brick(score, config.specialIndices.includes(index));
    });
    return new Column(bricks);
});

const svg = sd.svg();
const C = sd.color();
const posI = 2;
const grid = new sd.Grid(svg).elementWidth(80).axis("col");

sd.init(() => {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        for (let brickIndex = 0; brickIndex < column.bricks.length; brickIndex++) {
            const brick = column.bricks[brickIndex];
            grid.insert(colIndex, brickIndex, brick.score);
            grid.color(colIndex, brickIndex, brick.isSpecial ? C.yellow : C.green);
        }
    }
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(grid, "第i列", "b").startAnimate().moveTo(grid.element(posI, 0)).endAnimate();
    sd.Brace(grid, "t").brace(grid.element(0, 0), grid.element(posI, 0)).startAnimate().pointStoT().value("j颗").endAnimate();
    await sd.pause();
    sd.Pointer(grid, "k颗", "t")
        .startAnimate()
        .moveTo(grid.element(posI, grid.endM(posI)))
        .endAnimate();
    await sd.pause();
    sd.Brace(grid, "b")
        .brace(grid.element(0, grid.endM(0)), grid.element(posI - 1, grid.endM(posI - 1)))
        .startAnimate()
        .pointTtoS()
        .value("j-k颗")
        .endAnimate();
});
