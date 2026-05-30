import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const V = sd.vec();

function c(n, m) {
    function f(n) {
        if (n === 0) return 1;
        return f(n - 1) * n;
    }
    return f(n) / f(m) / f(n - m);
}

export function interactiveVenn(venn) {
    let count = 0;
    const stack = new sd.ValueStack(svg).align("x").elementHeight(70);
    const keys = ["A", "B", "C", "D"];
    for (; count < keys.length; count++) {
        if (!venn.hasChild(keys[count])) break;
    }
    const grad = C.doubleGradient(C.textBlue, C.white, C.pureRed, -9, 0, 9);
    const vennPathes = {};
    for (let i = 1; i <= count; i++) {
        vennPathes[i] = [];
        vennPathes[i].layerCount = 0;
        const set = [];
        const pathes = [];
        function dfs(current, depth) {
            if (depth === count) {
                if (current !== i) return;
                const shapes = [];
                for (let j = 0; j < i; j++) shapes.push(venn.child(set[j]));
                pathes.push(V.polyIntersect(shapes));
                vennPathes[i].push(V.polyIntersectLogic(shapes));
                return;
            }
            dfs(current, depth + 1);
            set.push(keys[depth]);
            dfs(current + 1, depth + 1);
            set.pop();
        }
        dfs(0, 0);
        const array = new sd.ValueArray(svg).elementWidth(60);
        const math = new sd.Math(array, "+0").fontSize(10);

        let layerAdd = 0;
        async function updateVenn(delta) {
            sd.inter(async () => {
                function label(x) {
                    if (x >= 0) return `+${x}`;
                    return x;
                }
                layerAdd += delta;
                math.startAnimate().transformMath(label(layerAdd)).endAnimate();
                pathes.forEach(path => {
                    path.startAnimate().fill(grad(layerAdd)).endAnimate();
                });
                for (let j = i; j <= count; j++) {
                    vennPathes[j].layerCount += delta * c(j, i);
                    vennPathes[j].forEach(path => {
                        path.startAnimate().fill(grad(vennPathes[j].layerCount)).endAnimate();
                    });
                }
            });
        }
        function onMinus() {
            updateVenn(-1);
        }
        function onAdd() {
            updateVenn(1);
        }
        sd.Aside(array, new sd.Button(div).text("-").width(30).onClick(onMinus), "lc");
        sd.Aside(array, new sd.Button(div).text("+").width(30).onClick(onAdd), "rc");
        sd.Aside(array, math, "rc", 50);
        let scale = 1;
        pathes.forEach(path => {
            const k = 50 / path.height();
            scale = Math.min(scale, k);
        });
        pathes.forEach(path => {
            array.push(path.scale(scale));
        });
        stack.push(array);
    }
    stack.x(venn.mx() + 80).cy(venn.cy());

    console.log(vennPathes);

    let sum = vennPathes[count][0];
    vennPathes[count][0] = V.polyIntersect(vennPathes[count]);
    for (let i = count - 1; i >= 1; i--) {
        sum = V.polyUnionLogic(sum, ...vennPathes[i + 1]);
        for (let j = 0; j < vennPathes[i].length; j++) {
            const current = V.polySubtract(vennPathes[i][j], sum);
            vennPathes[i][j] = current.fill(C.white);
        }
    }
    const group = new sd.SD2DNode(svg);
    for (let i = 0; i < count; i++) {
        venn.child(keys[i]).child("label").attachTo(group);
    }
}
