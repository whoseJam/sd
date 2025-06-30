import { Enter as EN } from "@/Node/Core/Enter";
import { D3Layout, Tree } from "@/Node/Tree/Tree";

export class ValueTree extends Tree {
    constructor(target) {
        super(target);

        this.type("ValueTree");

        this.uneffect("tree");
        this.effect("tree", () => {
            const x = this.x();
            const y = this.y();
            const position = node => {
                return [node.x + x, node.y + y];
            };
            D3Layout.call(this, "vertical", position);
        });
    }
}

Object.assign(ValueTree.prototype, {
    newNode(id, value) {
        const element = value;
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistValue: Tree.prototype.newNodeFromExistElement,
});
