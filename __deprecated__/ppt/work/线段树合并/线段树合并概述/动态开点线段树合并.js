import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
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
    function transferSubtree(to, tt, x) {
        function transferNode(id) {
            const node = to.element(id);
            const clone = new sd.Vertex(svg).value(node.text()).center(node.center()).opacity(node.opacity());
            sd.Label(clone, node.label.text(), "tc", 15, 1);
            clone.startAnimate().center(t3.element(id).center()).endAnimate().remove();
            tt.element(id).after(300).opacity(node.opacity());
        }
        function transferLine(sourceId, targetId) {
            const link = to.element(sourceId, targetId);
            const clone = new sd.Line(svg).source(link.source()).target(link.target()).opacity(link.opacity());
            clone.startAnimate();
            clone.source(t3.element(sourceId, targetId).source());
            clone.target(t3.element(sourceId, targetId).target());
            clone.endAnimate().remove();
            tt.element(sourceId, targetId).after(300).opacity(link.opacity());
        }
        if (x > 1) {
            transferLine(x >> 1, x);
        }
        to.forEachNodeInSubtree(x, (node, id) => {
            transferNode(id);
        });
        to.forEachLinkInSubtree(x, (link, sourceId, targetId) => {
            transferLine(sourceId, targetId);
        });
    }
    async function dfs(x, l, r) {
        await sd.pause();
        px.startAnimate().moveTo(x).endAnimate();
        py.startAnimate().moveTo(x).endAnimate();
        if (t1.element(x).opacity() < 1 && t2.element(x).opacity() < 1) {
            await sd.pause();
            t3.startAnimate();
            if (x > 1) t3.element(x >> 1, x).opacity(0.3);
            t3.forEachNodeInSubtree(x, node => node.opacity(0.3));
            t3.forEachLinkInSubtree(x, link => link.opacity(0.3));
            t3.endAnimate();
            return;
        } else if (t1.element(x).opacity() < 1) {
            await sd.pause();
            if (x > 1)
                sd.Link(t1.element(x >> 1), t2.element(x))
                    .stroke(C.red)
                    .opacity(0)
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
            transferSubtree(t2, t3, x);
            return;
        } else if (t2.element(x).opacity() < 1) {
            await sd.pause();
            transferSubtree(t1, t3, x);
            return;
        } else {
            await sd.pause();
            t3.startAnimate();
            if (x > 1) t3.element(x >> 1, x).opacity(1);
            t3.element(x).opacity(1);
            t3.endAnimate();
            t1.startAnimate();
            t1.element(x).value(t3.text(x));
            t1.endAnimate();
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
            return;
        }
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
        if (sum(l, r) === 0) {
            if (x > 1) tree.newNode(x, "");
            if (x > 1) tree.link(x >> 1, x);
            tree.opacity(x, 0.3);
            tree.opacity(x >> 1, x, 0.3);
        } else {
            if (x > 1) tree.newNode(x, sum(l, r));
            if (x > 1) tree.link(x >> 1, x);
        }
        const mid = (l + r) >> 1;
        tree.element(x).label = sd.Label(tree.element(x), `[${l},${r}]`, "tc", 15, 1);
        if (l === r) return;
        dfs(x << 1, l, mid);
        dfs((x << 1) | 1, mid + 1, r);
    }
    tree.root(1, sum(1, n));
    dfs(1, 1, n);
    return tree;
}
