import { HorizontalTree } from "@/Node/Tree/HorizontalTree";
import { ValueTree } from "@/Node/Tree/ValueTree";

export class HorizontalValueTree extends HorizontalTree {
    constructor(target) {
        super(target);

        this.type("HorizontalValueTree");

        this.vars.merge({
            layerWidth: 60,
        });
    }
}

HorizontalValueTree.prototype.newNode = ValueTree.prototype.newNode;
