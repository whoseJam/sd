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

const K = 3;
const columnConfigs = [
    { brickScores: [1, 1, 1], specialIndices: [0, 2] },
    { brickScores: [1, 1, 1], specialIndices: [0, 2] },
    { brickScores: [1, 1, 1], specialIndices: [0, 2] },
];

const columns = columnConfigs.map(config => {
    const bricks = config.brickScores.map((score, index) => {
        return new Brick(score, config.specialIndices.includes(index));
    });
    return new Column(bricks);
});

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).elementWidth(80).axis("col");
let clickCount = K;
let totalScore = 0;
const scoreLabel = new sd.Label(grid, "", "tc");

function initGame() {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        for (let brickIndex = 0; brickIndex < column.bricks.length; brickIndex++) {
            const brick = column.bricks[brickIndex];
            grid.insert(colIndex, brickIndex, brick.score);
            grid.color(colIndex, brickIndex, brick.isSpecial ? C.yellow : C.green);
        }
    }
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const button = new sd.Button(grid)
            .text("消除")
            .cx(grid.element(colIndex, 0).cx())
            .y(grid.my() + 10);
        const col = colIndex;
        button.onClick(() => {
            sd.inter(async () => {
                if (clickCount > 0) {
                    clickCount--;
                    if (grid.endM(col) >= grid.startM()) {
                        const removedBrick = grid.element(col, grid.endM(col));
                        grid.startAnimate().erase(col, grid.endM(col)).endAnimate();
                        totalScore += removedBrick.intValue();
                        if (removedBrick.fill() === C.yellow) clickCount++;
                        scoreLabel.after(0).startAnimate();
                        updateScoreDisplay();
                        scoreLabel.endAnimate();
                    }
                }
            });
        });
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreLabel.text(`click:${clickCount} score:${totalScore}`, [
        ["click:", "click:"],
        ["score:", "score:"],
    ]);
}

sd.init(() => {
    initGame();
});

sd.main(() => {});
