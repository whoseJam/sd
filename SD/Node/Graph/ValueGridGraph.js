import { Enter as EN } from "@/Node/Core/Enter";
import { GridGraph } from "@/Node/Graph/GridGraph";

export function ValueGridGraph(parent) {
    GridGraph.call(this, parent);

    this.type("ValueGridGraph");
}

ValueGridGraph.prototype = {
    ...GridGraph.prototype,
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
};

ValueGridGraph.prototype.newNodeFromExistValue = ValueGridGraph.prototype.newNodeFromExistElement;
