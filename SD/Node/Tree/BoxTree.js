import { Box } from "@/Node/Element/Box";
import { D3Layout, Tree } from "@/Node/Tree/Tree";
import { Factory } from "@/Utility/Factory";

export class BoxTree extends Tree {
    constructor(target) {
        super(target);

        this.type("BoxTree");

        this._.nodeType = Box;

        this.vars.merge({
            elementWidth: 60,
            elementHeight: 40,
        });

        this.uneffect("tree");
        this.effect("tree", () => {
            const x = this.x();
            const y = this.y();
            const width = this.elementWidth();
            const height = this.elementHeight();
            const position = node => {
                return [node.x + x, node.y + y];
            };
            const size = node => {
                node.width(width);
                node.height(height);
            };
            D3Layout.call(this, "vertical", position, size);
        });
    }
}

Object.assign(BoxTree.prototype, {
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
});
