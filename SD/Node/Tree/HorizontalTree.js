import { D3Layout, Tree } from "@/Node/Tree/Tree";
import { Factory } from "@/Utility/Factory";

export class HorizontalTree extends Tree {
    constructor(target) {
        super(target);

        this.type("HorizontalTree");

        this.vars.merge({
            width: 0,
            height: 300,
            layerWidth: 60,
        });

        this.uneffect("tree");
        this.effect("tree", () => {
            const x = this.x();
            const y = this.y();
            const position = node => {
                return [node.y + x, node.x + y];
            };
            D3Layout.call(this, "horizontal", position);
        });
    }
}

Object.assign(HorizontalTree.prototype, {
    height: Factory.handlerLowPrecise("height"),
    layerWidth: Factory.handlerLowPrecise("layerWidth"),
    width(width) {
        if (width === undefined) return this.vars.width;
        const depth = this.depth();
        this.layerWidth(width / depth);
        return this;
    },
});
