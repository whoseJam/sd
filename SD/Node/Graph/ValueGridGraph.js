import { Enter as EN } from "@/Node/Core/Enter";
import { GridGraph } from "@/Node/Graph/GridGraph";

export class ValueGridGraph extends GridGraph {
    constructor(target) {
        super(target);

        this.type("ValueGridGraph");
    }
}

Object.assign(ValueGridGraph.prototype, {
    newNode(id, value) {
        const element = value;
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistElement(id, value) {
        const element = value;
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.onEnter(EN.moveTo("nodes"));
        this.__insertNode(id, element);
        return this;
    },
});

ValueGridGraph.prototype.newNodeFromExistValue = ValueGridGraph.prototype.newNodeFromExistElement;
