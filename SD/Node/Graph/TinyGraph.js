import { Enter as EN } from "@/Node/Core/Enter";
import { effect } from "@/Node/Core/Reactive";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Cast } from "@/Utility/Cast";

export function TinyGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("TinyGraph");

    this.effect("tinyGraph", () => {});
    this._.updater = effect(() => {
        const update = updateMap[this.vars.nodes.length];
        update?.call(this, this.vars.nodes);
    });
}

TinyGraph.prototype = {
    ...BaseGraph.prototype,
    newNode(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newLink: GridGraph.prototype.newLink,
};

const updateMap = {
    1: function (nodes) {
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.cy());
        });
    },
    2: function (nodes) {
        const w = this.width() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.cy());
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.mx() - w).cy(this.cy());
        });
    },
    3: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
    },
    4: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x() + w).cy(this.y() + h);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx() - w).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.mx() - w).cy(this.y() + h);
        });
    },
    5: function (nodes) {
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.x()).cy(this.y());
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x()).cy(this.my());
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.mx()).cy(this.my());
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.mx()).cy(this.y());
        });
        this.tryUpdate(nodes[4], () => {
            nodes[4].cx(this.cx()).cy(this.cy());
        });
    },
    6: function (nodes) {
        const w = this.width() / 4;
        const h = this.height() / 4;
        this.tryUpdate(nodes[0], () => {
            nodes[0].cx(this.cx()).cy(this.y() + h / 2);
        });
        this.tryUpdate(nodes[1], () => {
            nodes[1].cx(this.x() + w / 2).cy(this.y() + h);
        });
        this.tryUpdate(nodes[2], () => {
            nodes[2].cx(this.x() + w / 2).cy(this.my() - h);
        });
        this.tryUpdate(nodes[3], () => {
            nodes[3].cx(this.cx()).cy(this.my() - h / 2);
        });
        this.tryUpdate(nodes[4], () => {
            nodes[4].cx(this.mx() - w / 2).cy(this.my() - h);
        });
        this.tryUpdate(nodes[5], () => {
            nodes[5].cx(this.mx() - w / 2).cy(this.y() + h);
        });
    },
};
