import { Enter as EN } from "@/Node/Core/Enter";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";

export function GridGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("GridGraph");

    this.vars.merge({
        n: 1,
        m: 1,
    });

    this._.curN = 0;
    this._.curM = 0;
    this._.pos = {};

    this.effect("nodes", () => {
        const pos = this._.pos;
        const x = this.x();
        const mx = this.mx();
        const w = (mx - x) / this.m();
        const y = this.y();
        const my = this.my();
        const h = (my - y) / this.n();
        const position = node => {
            return [pos[node.id].y * w + x, pos[node.id].x * h + y];
        };
        for (const node of this.vars.nodes) {
            this.tryUpdate(node, () => {
                node.center(position(node));
            });
        }
    });
}

GridGraph.prototype = {
    ...BaseGraph.prototype,
    n: Factory.handler("n"),
    m: Factory.handler("m"),
    at(i, j) {
        this._.curN = i;
        this._.curM = j;
        return this;
    },
    newNode(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistValue(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    newNodeFromExistElement(id, value) {
        const element = value;
        this._.pos[element.id] = { x: this._.curN, y: this._.curM };
        element.onEnter(EN.moveTo("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newLink(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links")).opacity(0);
        element.value(value);
        element.onEnter(EN.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
    newLinkFromExistValue(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links")).opacity(0);
        element.onEnter(EN.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    newLinkFromExistElement(sourceId, targetId, value) {
        const element = value;
        element.onEnter(EN.moveTo("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
};
