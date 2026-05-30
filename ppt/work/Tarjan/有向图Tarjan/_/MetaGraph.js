import * as sd from "@/sd";

export class MetaGraph extends sd.TinyGraph {
    constructor(target, n, links) {
        super(target);
        this.width(180).height(180);
        for (let i = 1; i <= n; i++) this.newNode(i, " ");
        links.forEach(([x, y]) => {
            this.newLink(x, y);
            this.element(x, y).arrow();
        });
    }
}
