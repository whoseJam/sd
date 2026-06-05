import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const blocks = [
    [3, 2],
    [0, 2],
    [1, 6],
    [3, 0],
    [3, 6],
];
const [sx, sy] = [0, 0];
const [ex, ey] = [7, 2];

class Structure extends sd.SD2DNode {
    constructor(target) {
        super(target);

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
        });
        const v1 = new sd.Vertex(svg).r(5);
        const v2 = new sd.Vertex(svg).r(5);
        const v3 = new sd.Vertex(svg).r(5);
        const v4 = new sd.Vertex(svg).r(5);
        sd.Link(v1, v2).strokeDashArray([1, 1]);
        sd.Link(v3, v4).strokeDashArray([1, 1]);
        sd.Link(v1, v3);
        sd.Link(v1, v4);
        sd.Link(v2, v3);
        sd.Link(v2, v4);
        this.childAs(v1, (parent, child) => child.x(parent.x()).cy(parent.cy()));
        this.childAs(v2, (parent, child) => child.mx(parent.mx()).cy(parent.cy()));
        this.childAs(v3, (parent, child) => child.cx(parent.cx()).y(parent.y()));
        this.childAs(v4, (parent, child) => child.cx(parent.cx()).my(parent.my()));
    }
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.lpset("x", x);
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.lpset("y", y);
        return this;
    }
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        this.vars.lpset("width", width);
        return this;
    }
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        this.vars.lpset("height", height);
        return this;
    }
}

const coord = new sd.FixGapCoord(svg).ticks("x", [-1, 7, 1]).ticks("y", [-1, 6, 1]);

sd.init(() => {
    blocks.forEach(block => {
        block.structure = new Structure(svg).center(coord.global(block));
    });
    const start = new sd.Circle(svg).r(5).color(C.green).center(coord.global(sx, sy));
    const end = new sd.Circle(svg).r(5).color(C.green).center(coord.global(ex, ey));
    blocks.push([sx, sy]);
    blocks[blocks.length - 1].structure = start;
    blocks.push([ex, ey]);
    blocks[blocks.length - 1].structure = end;
    for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
            if (blocks[i][0] === blocks[j][0] || blocks[i][1] === blocks[j][1]) {
                if (blocks[i][0] === blocks[j][0] && notFound(0, blocks[i][0], blocks[i][1], blocks[j][1])) sd.Link(blocks[i].structure, blocks[j].structure);
                if (blocks[i][1] === blocks[j][1] && notFound(1, blocks[i][1], blocks[i][0], blocks[j][0])) sd.Link(blocks[i].structure, blocks[j].structure);
            }
        }
    }
});

function notFound(rank, target, l, r) {
    const l_ = Math.min(l, r);
    const r_ = Math.max(l, r);
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i][rank] !== target) continue;
        if (l_ < blocks[i][rank ^ 1] && blocks[i][rank ^ 1] < r_) return false;
    }
    return true;
}

sd.main(async () => {});
