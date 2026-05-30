import * as sd from "@/sd";

const C = sd.color();

export class MatchingGraph extends sd.BipartiteGraph {
    constructor(target, n, links, interactable = false) {
        super(target);
        this.height(200);
        this._.n = n;
        for (let i = 1; i <= n; i++) {
            this.newNode(i, 0);
            this.newNode(i + n, i, 1);
        }
        links.forEach(link => {
            this.link(link[0], link[1] + n);
        });
        if (interactable) {
            let node1;
            let node2;
            const f1 = sd.Focus(this);
            const f2 = sd.Focus(this);
            this.forEachNode((node, id) => {
                node.onClick(() => {
                    sd.inter(async () => {
                        if (id <= n) {
                            node1 = node;
                            f1.startAnimate().focus(node1).endAnimate();
                        } else {
                            node2 = node;
                            f2.startAnimate().focus(node2).endAnimate();
                        }
                        if (node1 && node2 && this.findLinkById(this.nodeId(node1), this.nodeId(node2))) {
                            f1.after(0).startAnimate().focus(null).endAnimate();
                            f2.after(0).startAnimate().focus(null).endAnimate();
                            this.element(node1, node2).startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
                            node1.startAnimate().color(C.blue).endAnimate();
                            node2.startAnimate().color(C.blue).endAnimate();
                            node1.onClick(null);
                            node2.onClick(null);
                            node1 = undefined;
                            node2 = undefined;
                        }
                    });
                });
            });
        }
    }
    match(x, y) {
        this.color(x, C.blue).color(y + this._.n, C.blue);
        this.element(x, y + this._.n)
            .stroke(C.red)
            .strokeWidth(3);
        return this;
    }
}
