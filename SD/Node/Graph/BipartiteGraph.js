import { Enter as EN } from "@/Node/Core/Enter";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Cast } from "@/Utility/Cast";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BipartiteGraph extends BaseGraph {
    constructor(target) {
        super(target);

        this.type("BipartiteGraph");

        this.vars.merge({
            r: 20,
            width: 600,
            height: 250,
        });

        this._.no = {};

        this.effect("nodes", () => {
            const no = this._.no;
            const orderedNodes = [];
            const count = [0, 0];
            const currentIndex = [1, 1];
            this.forEachNode(node => {
                orderedNodes.push(node);
                count[no[node.id]]++;
            });
            const x = this.x();
            const mx = this.mx();
            const gap = [(mx - x) / (count[0] + 1), (mx - x) / (count[1] + 1)];
            const position = node => {
                return x + gap[no[node.id]] * currentIndex[no[node.id]];
            };
            for (const node of orderedNodes) {
                const x = position(node);
                const yLocator = ["y", "my"][no[node.id]];
                this.tryUpdate(node, () => {
                    node.cx(x);
                    node[yLocator](this[yLocator]());
                    currentIndex[no[node.id]]++;
                });
            }
        });
    }
}

Object.assign(BipartiteGraph.prototype, {
    newNode(id, value, no) {
        if (arguments.length === 2) return this.newNode(id, undefined, value);
        if (no === undefined) ErrorLauncher.invalidArguments();
        const element = new this._.nodeType(this.layer("nodes"));
        this._.no[element.id] = no;
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistElement(id, value, no) {
        const element = value;
        this._.no[element.id] = no;
        element.onEnter(EN.moveTo("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newLink: GridGraph.prototype.newLink,
    newLinkFromExistValue: GridGraph.prototype.newLinkFromExistValue,
    newLinkFromExistElement: GridGraph.prototype.newLinkFromExistElement,
});
