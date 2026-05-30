import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const versions = [];
const board = new sd.Stack(svg).elementWidth(200);
const boardPointer = sd.Pointer(board, "i", "r");
const n = 4;
let tot = 0;
const operator = [
    { op: "M", pos: 1, value: 1, gap: 0},
    { op: "M", pos: 2, value: 3, gap: 80},
    { op: "M", pos: 3, value: 2, gap: 80},
    { op: "M", pos: 4, value: 3, gap: 80},
];

sd.init(init);
sd.main(main);

function init() {
    for (let i = 0; i < operator.length; i++) {
        board.push(`pos=${operator[i].pos} value=${operator[i].value}`);
    }
    board.x(100).cy(100 + 130);
}

async function main() {
    for (let i = 0; i < operator.length; i++) {
        await sd.pause();
        boardPointer.startAnimate().moveTo(i).endAnimate();
        if (operator[i].op === "M") {
            await insert(operator[i].pos, operator[i].value);
        }
    }
    for (let i = 0; i < versions.length; i++)
        await query(i);
    await sd.pause();
}

function findNodeById(nodeId) {
    for (let i = 0; i < versions.length; i++) {
        if (versions[i].findNodeById(nodeId)) {
            return versions[i].findNodeById(nodeId);
        }
    }
    return undefined;
}

async function query(v) {
    const tree = versions[v];
    const dfs = (x, l, r, col) => {
        if (!x) return;
        if (l === r) {
            findNodeById(x).startAnimate().color(col).endAnimate();
            return;
        }
        const mid = (l + r) >> 1;
        dfs(findNodeById(x).leftChild, l, mid, col);
        dfs(findNodeById(x).rightChild, mid + 1, r, col);
    }
    await sd.pause();
    tree.root().startAnimate().color(C.green).endAnimate();
    dfs(tree.root().nodeId, 1, n, C.green);
    await sd.pause();
    tree.root().startAnimate().color(C.white).endAnimate();
    dfs(tree.root().nodeId, 1, n, C.white);
}

async function insert(pos, value) {
    const length = versions.length;
    const lastVersion = length > 0 ? versions[length - 1] : undefined;
    const tree = new sd.BinaryTree(svg).layerHeight(130);
    versions.push(tree);
    const rk = versions.length;
    let gapSum = 0;
    for (let i = 0; i < rk; i++) gapSum += operator[i].gap; 
    tree.x(300 + gapSum).y(100);

    const dfsInsert = async function(fa, childType, lastx, l, r, pos, value) {
        await sd.pause();

        if (!fa) tree.startAnimate().root(++tot).endAnimate();
        else tree.startAnimate().newNode(++tot)[childType](fa, tot).endAnimate();

        const vertex = tree.element(tot);

        if (l === r) {
            const text = new sd.Text(svg, `v=${value}`);
            text.cx(vertex.cx()).y(vertex.my() + 10);
            text.opacity(0).startAnimate().opacity(1);
            return;
        }

        const mid = (l + r) >> 1;
        const id = tot;

        const lastVertex = findNodeById(lastx);
        if (lastVertex) {
            if (pos <= mid) {
                vertex.leftChild = tot + 1;
                vertex.rightChild = lastVertex.rightChild;
                const lastRightChild = findNodeById(lastVertex.rightChild);
                if (lastRightChild) {
                    // await sd.pause();
                    sd.Link(vertex, lastRightChild).opacity(0).stroke(C.red).strokeWidth(3).startAnimate().opacity(1).endAnimate();
                }
                await dfsInsert(id, "leftChild", lastVertex.leftChild, l, mid, pos, value);
                return;
            } else if (pos > mid){
                await sd.pause();
                vertex.leftChild = lastVertex.leftChild;
                vertex.rightChild = tot + 1;
                const lastLeftChild = findNodeById(lastVertex.leftChild);
                if (lastLeftChild) {
                    // await sd.pause();
                    sd.Link(vertex, lastLeftChild).opacity(0).stroke(C.deepSkyBlue).strokeWidth(3).startAnimate().opacity(1).endAnimate();
                }
                await dfsInsert(id, "rightChild", lastVertex.rightChild, mid + 1, r, pos, value);
                return;
            }
        }
        if (pos <= mid) {
            vertex.leftChild = tot + 1;
            await dfsInsert(id, "leftChild", undefined, l, mid, pos, value);
        } else {
            vertex.rightChild = tot + 1;
            await dfsInsert(id, "rightChild", undefined, mid + 1, r, pos, value);
        }
    }
    await dfsInsert(0, undefined, lastVersion ? lastVersion.root().nodeId : undefined, 
        1, n, pos, value);
}