import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const graph = new sd.DAG(svg).width(200).height(200);
const arr = new sd.Array(svg);
const n = 5;
const m = 6;
const links = I.readIntMatrix(`
1 2 
1 3 
4 2 
3 4 
2 5 
5 3`, m, 2, false);

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
            sd.inter(async () => {
                tmp ^= 1;
                arr.startAnimate().color(i, tmp ? C.green : C.white).endAnimate();
                const adj = [...graph.outNodes(i, "undirect"), graph.element(i)];
                
                adj.forEach(node => {
                    node.open ^= 1;
                    node.startAnimate().color(node.open ? C.green : C.white).endAnimate();
                })
            })
        })
    }
});

sd.main(async () => {});