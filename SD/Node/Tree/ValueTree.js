import { Enter as EN } from "@/Node/Core/Enter";
import { D3Layout, Tree } from "@/Node/Tree/Tree";

export function ValueTree(parent) {
    Tree.call(this, parent);

    this.type("ValueTree");

    this.uneffect("tree");
    this.effect("valueTree", () => {
        const x = this.x();
        const y = this.y();
        const position = node => {
            return [node.x + x, node.y + y];
        };
        D3Layout.call(this, "vertical", position);
    });
}

ValueTree.prototype = {
    ...Tree.prototype,
};

ValueTree.prototype.newNode = function (id, value) {
    const element = value;
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
};

ValueTree.prototype.newNodeFromExistValue = Tree.prototype.newNodeFromExistElement;
