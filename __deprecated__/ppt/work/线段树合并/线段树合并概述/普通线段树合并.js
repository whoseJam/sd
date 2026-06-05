import * as sd from "@/sd";

const svg = sd.svg();
const n = 8;
const seq1 = [1, 2, 0, 0, 2, 0, 0, 0];
const seq2 = [0, 0, 3, 1, 1, 1, 0, 0];
const t1 = makeTree(n, seq1);
const t2 = makeTree(n, seq2).x(t1.mx() + 80);

sd.init(() => {
    new sd.Array(t1)
        .pushArray(seq1)
        .cx(t1.cx())
        .my(t1.y() - 40);
    new sd.Array(t2)
        .pushArray(seq2)
        .cx(t2.cx())
        .my(t2.y() - 40);
});

sd.main(async () => {
    await sd.pause();
    new sd.Text(svg, "+")
        .cx((t1.cx() + t2.cx()) / 2)
        .cy(t1.y() - 60)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    const seq3 = [];
    seq1.forEach((value, i) => {
        seq3.push(value + seq2[i]);
    });
    const t3 = makeTree(n, seq3)
        .cx((t1.cx() + t2.cx()) / 2)
        .y(t1.my() + 40);
    t3.forEachNode(node => node.opacity(0));
    t3.forEachLink(link => link.opacity(0));
    const px = sd.Pointer(t1, "x", "l");
    const py = sd.Pointer(t2, "y", "r");
    async function dfs(x, l, r) {
        await sd.pause();
        px.startAnimate().moveTo(x).endAnimate();
        py.startAnimate().moveTo(x).endAnimate();
        await sd.pause();
        t3.startAnimate();
        if (x > 1) t3.element(x >> 1, x).opacity(1);
        t3.element(x).opacity(1);
        t3.endAnimate();
        if (l === r) return;
        const mid = (l + r) >> 1;
        await dfs(x << 1, l, mid);
        await sd.pause();
        px.startAnimate().moveTo(x).endAnimate();
        py.startAnimate().moveTo(x).endAnimate();
        await dfs((x << 1) | 1, mid + 1, r);
        await sd.pause();
        px.startAnimate().moveTo(x).endAnimate();
        py.startAnimate().moveTo(x).endAnimate();
    }
    await dfs(1, 1, n);
});

function makeTree(n, seq) {
    const tree = new sd.BinaryTree(svg).width(500);
    function sum(l, r) {
        let ans = 0;
        for (let i = l - 1; i <= r - 1; i++) ans += seq[i];
        return ans;
    }
    function dfs(x, l, r) {
        const mid = (l + r) >> 1;
        if (x > 1) {
            tree.newNode(x, sum(l, r));
            tree.link(x >> 1, x);
        }
        sd.Label(tree.element(x), `[${l},${r}]`, "tc", 15, 1);
        if (l === r) return;
        dfs(x << 1, l, mid);
        dfs((x << 1) | 1, mid + 1, r);
    }
    tree.root(1, sum(1, n));
    dfs(1, 1, n);
    return tree;
}
