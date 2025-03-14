import { HorizontalTree } from "@/Node/Tree/HorizontalTree";
import { ValueTree } from "@/Node/Tree/ValueTree";

export function HorizontalValueTree(parent) {
    HorizontalTree.call(this, parent);

    this.type("HorizontalValueTree");

    this.vars.merge({
        layerWidth: 60,
    });
}

HorizontalValueTree.prototype = {
    ...HorizontalTree.prototype,
};

HorizontalValueTree.prototype.newNode = ValueTree.prototype.newNode;
