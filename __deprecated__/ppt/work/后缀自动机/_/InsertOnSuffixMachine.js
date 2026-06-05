import * as sd from "@/sd";
import { suffixMachine } from "./SuffixMachine";

/**
 *
 * @param {sd.BaseGraph} graph
 * @param {sd.BaseTree} tree
 * @param {sd.BaseArray} arr
 * @param {string} character
 * @param {number} characterSet
 * @param {{
 *  onCreateNewNodeOnGraph: (u: number) => void
 *  onCreateCommonSuffixNodeOnGraph: (u: number) => void
 *  onCreateNewLinkOnGraph: (u: number, v: number) => void
 *  onCreateNewNodeOnTree: (u: number) => sd.SDNode
 *  onCreateCommonSuffixNodeOnTree: (u: number) => sd.SDNode
 *  labelLocationForNewNodeOnTree: string
 * }} args
 */
export async function insertOnSuffixMachine(graph, tree, arr, character, characterSet, args) {
    const svg = sd.svg();
    const C = sd.color();
    const R = sd.rule();
    let str = "";
    arr.forEachElement(element => (str += element.text()));
    const [fa, ch, len, tot, lst] = suffixMachine(str);
    const onCreateNewNodeOnGraph = args.onCreateNewNodeOnGraph;
    const onCreateCommonSuffixNodeOnGraph = args.onCreateCommonSuffixNodeOnGraph;
    const onCreateNewLinkOnGraph = args.onCreateNewLinkOnGraph;
    const onCreateNewNodeOnTree = args.onCreateNewNodeOnTree;
    const onCreateCommonSuffixNodeOnTree = args.onCreateCommonSuffixNodeOnTree;
    const labelLocationForNewNodeOnTree = args.labelLocationForNewNodeOnTree;

    function charCode(c) {
        return c.charCodeAt(0) - "a".charCodeAt(0);
    }
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
    function addStack(vertex) {
        const stack = new sd.ValueStack(vertex).align("mx").elementHeight(20);
        vertex.childAs("stk", stack, R.aside(labelLocationForNewNodeOnTree || "rt"));
    }
    function addLabel(vertex, target) {
        addStack(vertex);
        const stack = vertex.child("stk");
        const paths = [];
        search(1, target, [1], paths);
        paths.sort((a, b) => a.length - b.length);
        stack.startAnimate();
        paths.forEach(path => {
            let answer = "";
            for (let i = 0; i < path.length - 1; i++) answer += graph.linkText(path[i], path[i + 1]);
            stack.push(answer);
        });
        stack.endAnimate();
    }

    await sd.pause();
    arr.startAnimate();
    arr.push(character);
    arr.lastElement().color(C.blue);
    arr.endAnimate();

    await sd.pause();
    const cur = tot + 1;
    const com = tot + 2;
    const last = sd.Pointer(graph, "last", "t", 5, 20);
    last.startAnimate().moveTo(lst).endAnimate();
    graph.startAnimate().color(lst, C.green).endAnimate();

    await sd.pause();
    graph.startAnimate();
    if (onCreateNewNodeOnGraph) await onCreateNewNodeOnGraph(cur);
    else graph.newNode(cur);
    graph.color(cur, C.blue);
    sd.Label(graph.element(cur), str + character, "bc", 20, 5);
    graph.endAnimate();

    await sd.pause();
    let f = lst;
    const direction = charCode(character);
    while (f) {
        if (!ch[f][direction]) {
            tree.startAnimate().color(f, C.green).endAnimate();
            if (onCreateNewLinkOnGraph) await onCreateNewLinkOnGraph(+f, +cur);
            else {
                graph.newLink(f, cur);
                const link = graph.element(f, cur);
                const rule = R.pointAtPathByRate(0.5, "x", "y");
                link.startAnimate().pointStoT().value(character, rule).endAnimate().arrow();
            }
            ch[f][direction] = cur;
            graph.startAnimate().color(f, C.green).endAnimate();
            f = fa[f];
        } else {
            tree.startAnimate().color(f, C.red).endAnimate();
            if (onCreateNewLinkOnGraph) await onCreateNewLinkOnGraph(+f, +cur);
            else {
                graph.newLink(f, cur);
                const link = graph.element(f, cur);
                const rule = R.pointAtPathByRate(0.5, "x", "y");
                link.startAnimate().pointStoT().value(character, rule).endAnimate().arrow();
            }
            graph.startAnimate().color(f, C.red).endAnimate();
            break;
        }
    }
    const to = ch[f][direction];
    if (!f) {
        await sd.pause();
        let v = undefined;
        if (onCreateNewNodeOnTree) v = await onCreateNewNodeOnTree(cur);
        else v = new sd.Vertex(tree, cur).cx(tree.mx()).cy(tree.my());
        v.opacity(0).color(C.blue).startAnimate().opacity(1).endAnimate();
        sd.Link(tree.element(1), v).startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        addLabel(v, cur);
    } else if (len[to] === len[f] + 1) {
        await sd.pause();
        const link = graph.element(f, to);
        const clone = new sd.Line(svg).source(link.source()).target(link.target()).strokeWidth(2).stroke(C.red).startAnimate().pointStoT().endAnimate().arrow();
        const trans = sd.Link(tree.element(f), tree.element(to), sd.Curve).opacity(0.2).startAnimate().pointStoT().endAnimate().arrow();
        graph.startAnimate().color(to, C.orange).endAnimate();
        tree.startAnimate().color(to, C.orange).endAnimate();
        await sd.pause();
        let v = undefined;
        if (onCreateNewNodeOnTree) v = await onCreateNewNodeOnTree(cur);
        else v = new sd.Vertex(tree, cur).cx(tree.mx()).cy(tree.my());
        v.opacity(0).color(C.blue).startAnimate().opacity(1).endAnimate();
        sd.Link(tree.element(to), v).startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        addLabel(v, cur);
    } else {
        await sd.pause();
        const link = graph.element(f, to);
        const clone = new sd.Line(svg).source(link.source()).target(link.target()).strokeWidth(2).stroke(C.red).startAnimate().pointStoT().endAnimate().arrow();
        const trans = sd.Link(tree.element(f), tree.element(to), sd.Curve).opacity(0.2).startAnimate().pointStoT().endAnimate().arrow();
        graph.startAnimate().color(to, C.orange).endAnimate();
        tree.startAnimate().color(to, C.orange).endAnimate();

        await sd.pause();
        graph.startAnimate();
        if (onCreateCommonSuffixNodeOnGraph) await onCreateCommonSuffixNodeOnGraph(com);
        else graph.newNode(com);
        graph.color(com, C.yellow);
        graph.endAnimate();

        await sd.pause();
        clone.startAnimate().fadeStoT().endAnimate().remove();
        link.startAnimate().fadeStoT().endAnimate().arrow(null);
        graph.linkType(sd.Curve).newLink(f, com);
        graph.element(f, com).bending(-0.25).startAnimate().pointStoT().valueFromExist(link.drop(), R.pointAtPathByRate(0.5, "cx", "my")).endAnimate().arrow();
        for (let i = 0; i < characterSet; i++) {
            ch[com][i] = ch[to][i];
            if (!ch[to][i]) continue;
            const character = String.fromCharCode(i + "a".charCodeAt(0));
            const rule = R.pointAtPathByRate(0.2, "cx", "cy");
            graph.linkType(sd.Line).newLink(com, ch[to][i]);
            graph.element(com, ch[to][i]).stroke(C.deepSkyBlue).startAnimate().pointStoT().value(character, rule).endAnimate().arrow();
        }
        ch[f][direction] = com;
        await sd.pause();

        let common = undefined;
        let vertex = undefined;
        if (onCreateCommonSuffixNodeOnTree) common = await onCreateCommonSuffixNodeOnTree(com);
        else common = new sd.Vertex(tree, com).cx(tree.mx()).cy(tree.y());
        if (onCreateNewNodeOnTree) vertex = await onCreateNewNodeOnTree(cur);
        else vertex = new sd.Vertex(tree, cur).cx(tree.mx()).cy(tree.my());
        common.opacity(0).startAnimate().opacity(1).color(C.yellow).endAnimate();
        vertex.opacity(0).startAnimate().opacity(1).color(C.blue).endAnimate();

        await sd.pause();
        fa[to] = fa[cur] = com;
        fa[com] = f;
        tree.element(f, to).startAnimate().fadeStoT().endAnimate().arrow(null);
        sd.Link(tree.element(f), common).startAnimate().pointStoT().endAnimate().arrow();
        sd.Link(common, tree.element(to)).startAnimate().pointStoT().endAnimate().arrow();
        sd.Link(common, vertex).startAnimate().pointStoT().endAnimate().arrow();
        addStack(common);
        const stack = tree.element(to).child("stk");
        stack.startAnimate();
        common.child("stk").startAnimate();
        while (stack.length() > 0 && stack.firstElement().text().length <= len[f] + 1) {
            common.child("stk").pushFromExistElement(stack.dropFirstElement());
        }
        stack.endAnimate();
        common.child("stk").endAnimate();
        addLabel(vertex, cur);
    }
}
