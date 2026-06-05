import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const graph = new sd.TinyGraph(svg).width(200).height(200);
const stk1 = new sd.ValueStack(svg).elementHeight(40).cx(graph.mx() + 100).y(graph.y());
const stk2 = new sd.ValueStack(svg).elementHeight(40).cx(stk1.mx() + 100).y(graph.y());
const arr = new sd.Array(svg);
const n = 6;
const m = 6;
const links = I.readIntMatrix(`
1 2 
1 3 
4 2 
2 6
2 5
1 4`, m, 2, false);

sd.init(() => {
    links.forEach(link => {
        graph.link(link[0], link[1]);
    });
    arr.resize(n).cx(graph.cx()).y(graph.my() + 50).start(1);
    sd.Index(arr, "t");
    for (let i = 1; i <= n; i++) {
        graph.element(i).open = 0;
    }
    for (let i = 1; i <= n; i++) {
        let tmp = 0;
        arr.element(i).onClick(() => {
            tmp ^= 1;
            arr.color(i, tmp ? C.green : C.white);
            const adj = [...graph.outNodes(i, "undirect"), graph.element(i)];
            
            adj.forEach(node => {
                node.open ^= 1;
                node.color(node.open ? C.green : C.white);
            })
        })
    }
})

sd.main(async () => {
    const focus = sd.Focus(arr);
    const lim = Math.floor(n / 2);
    await sd.pause();
    focus.startAnimate().focus(1, lim).endAnimate();
    stk1.startAnimate();
    dfs(sd.make1d(n + 5), 1, lim, stk1);
    stk1.endAnimate();
    
    await sd.pause();
    focus.startAnimate().focus(lim + 1, n).endAnimate();
    stk2.startAnimate();
    dfs(sd.make1d(n + 5), lim + 1, n, stk2);
    stk2.endAnimate();

    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
})

function changeStatus(u, status) {
    const adj = [...graph.outNodes(u, "undirect"), graph.element(u)];
    adj.forEach(node => {
        status[+graph.nodeId(node)] ^= 1;
    });
}

function dfs(status, cur, dep, stack, mark = []) {
    if (cur === dep + 1) {
        stack.push(createSubgraph(status, mark));
        return;
    }
    changeStatus(cur, status);
    mark.push(1);
    dfs(status, cur + 1, dep, stack, mark);
    mark.pop();
    changeStatus(cur, status);

    mark.push(0);
    dfs(status, cur + 1, dep, stack, mark);
    mark.pop();
}

function createSubgraph(status, mark) {
    const graph = new sd.TinyGraph(svg).width(30).height(30).freeze();
    for (let i = 1; i <= n; i++) graph.newNode(i, " ");
    links.forEach(link => {
        graph.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) graph.element(i).r(4);
    for (let i = 1; i <= n; i++) graph.color(i, status[i] ? C.green : C.white);
    graph.unfreeze();
    sd.Label(graph, mark.join(""));
    return graph;
}