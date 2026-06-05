import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const colors = [C.red, C.yellow, C.blue, C.green];

class ShapeA extends sd.PolygonSVG {
    constructor(target) {
        super(target, [
            [0, 0],
            [30, 0],
            [30, -20],
            [20, -20],
            [20, -10],
            [10, -10],
            [10, -20],
            [0, -20],
            [0, 0],
        ]);
    }
}

class ShapeT extends sd.PolygonSVG {
    constructor(target) {
        super(target, [
            [0, 0],
            [0, 10],
            [10, 10],
            [10, 20],
            [20, 20],
            [20, 10],
            [30, 10],
            [30, 0],
        ]);
    }
}

class ShapeTR extends sd.PolygonSVG {
    constructor(target) {
        super(target, [
            [0, 0],
            [30, 0],
            [30, -10],
            [20, -10],
            [20, -20],
            [10, -20],
            [10, -10],
            [0, -10],
        ]);
    }
}

class ShapeAR extends sd.PolygonSVG {
    constructor(target) {
        super(target, [
            [0, 0],
            [0, 20],
            [10, 20],
            [10, 10],
            [20, 10],
            [20, 20],
            [30, 20],
            [30, 0],
        ]);
    }
}

const n = 4;
const arrT = new sd.ValueArray(svg).elementWidth(50).start(1);
const arrA = new sd.ValueArray(svg)
    .elementWidth(50)
    .dy(160)
    .start(n + 1);
const stk = new sd.ValueStack(svg).x(300).elementHeight(25);
const links = [
    [3, 2, 1, sd.CircleCurve, "cx", "my"],
    [5, 6, 5, sd.CircleCurve, "cx", "y"],
    [7, 8, 2, sd.CircleCurve, "cx", "y"],
    [5, 8, 10, sd.CircleCurve, "cx", "y"],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arrT.push(new ShapeT(arrT));
        arrA.push(new ShapeA(arrA));
        arrT.lastElement().color(colors[i - 1]);
        arrA.lastElement().color(colors[i - 1]);
    }
    arrT.forEachElement((element, i) => sd.Label(element, i, "tc", 10, 0));
    arrA.forEachElement((element, i) => sd.Label(element, i, "bc", 10, 0));
});

sd.main(async () => {
    await sd.pause();
    links.forEach(link => {
        const link_ = new link[3](svg);
        link_.source(getElement(link[0]));
        link_.target(getElement(link[1]));
        const x = link[4] || "cx";
        const y = link[5] || "cy";
        link_.value(link[2], R.pointAtPathByRate(0.5, x, y));
        link_.opacity(0).startAnimate().opacity(1).endAnimate();
    });
    await sd.pause();
    stk.startAnimate().push(clone(1)).endAnimate();
    await sd.pause();
    pushData(clone(5), cloneRev(6));
    await sd.pause();
    pushData(cloneRev(2), clone(3));
    await sd.pause();
    pushData(clone(7), cloneRev(8));
    await sd.pause();
    stk.startAnimate().push(cloneRev(4)).endAnimate();
});

function pushData(a, b) {
    stk.startAnimate();
    sd.Link(a, b);
    stk.push(a);
    stk.push(b);
    stk.endAnimate();
}

function clone(i) {
    if (i > n) {
        const shape = new ShapeA(svg).color(colors[i - n - 1]);
        sd.Label(shape, i, "lc", 10, 2);
        return shape;
    } else {
        const shape = new ShapeT(svg).color(colors[i - 1]);
        sd.Label(shape, i, "lc", 10, 2);
        return shape;
    }
}

function cloneRev(i) {
    if (i > n) {
        const shape = new ShapeAR(svg).color(colors[i - n - 1]);
        sd.Label(shape, i, "lc", 10, 2);
        return shape;
    } else {
        const shape = new ShapeTR(svg).color(colors[i - 1]);
        sd.Label(shape, i, "lc", 10, 2);
        return shape;
    }
}

function getElement(i) {
    if (i > n) return arrA.element(i).center();
    return arrT.element(i).pos("cx", "my");
}
