import * as sd from "@/sd";
import { suffixMachine } from "./SuffixMachine";

/**
 *
 * @param {sd.BaseGraph} graph
 * @param {sd.BaseTree} tree
 * @param {string} str
 * @param {number} characterSet
 * @param {{
 *  onCreateNewNodeOnGraph: (u: number) => void
 * }} args
 */
export async function buildSuffixMachineWithLabel(graph, tree, str, characterSet, args) {
    const R = sd.rule();
    const onCreateNewNodeOnGraph = args.onCreateNewNodeOnGraph;
    const [fa, ch, len, tot] = suffixMachine(str);

    function search(u, target, path, paths) {
        if (u === target) {
            paths.push([...path]);
            return;
        }
        for (let i = 0; i < characterSet; i++) {
            if (ch[u][i]) {
                path.push(ch[u][i]);
                search(ch[u][i], target, path, paths);
                path.pop();
            }
        }
    }

    for (let i = 1; i <= tot; i++) {
        if (onCreateNewNodeOnGraph) await onCreateNewNodeOnGraph(i);
        else graph.newNode(i);
    }
    for (let i = 1; i <= tot; i++) {
        for (let v = 0; v < characterSet; v++) {
            if (ch[i][v]) {
                graph.newLink(i, ch[i][v]);
                const link = graph.element(i, ch[i][v]).arrow();
                const rule = link.width() <= 5 ? R.pointAtPathByRate(0.5, "x", "cy") : R.pointAtPathByRate(0.5, "cx", "my");
                link.value(String.fromCharCode(v + "a".charCodeAt(0)), rule);
            }
        }
    }
    tree.root(1);
    for (let i = 2; i <= tot; i++) {
        tree.link(fa[i], i);
        tree.element(fa[i], i).arrow();
    }
    for (let i = 2; i <= tot; i++) {
        const node = tree.element(i);
        const location = tree.element(i).cx() < tree.element(fa[i]).cx() ? "lt" : "rt";
        const stack = new sd.ValueStack(node).align("mx").elementHeight(20);
        node.childAs("stk", stack, R.aside(location));
    }
    for (let u = 2; u <= tot; u++) {
        const paths = [];
        search(1, u, [1], paths);
        paths.sort((a, b) => a.length - b.length);
        paths.forEach(path => {
            let answer = "";
            for (let i = 0; i < path.length - 1; i++) answer += graph.linkText(path[i], path[i + 1]);
            tree.element(u).child("stk").push(answer);
        });
    }
}
