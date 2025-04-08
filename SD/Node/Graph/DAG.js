import { mapTo } from "@/Math/Math";
import { Enter as EN } from "@/Node/Core/Enter";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { layout as DAGLayout, graphlib as DAGLib } from "dagre";

export function DAG(parent) {
    BaseGraph.call(this, parent);

    this.type("DAG");

    this.vars.merge({
        rankDir: "TB",
        align: undefined,
    });

    this._.graph = new DAGLib.Graph();
    this._.graph.setGraph({ rankdir: "TB" });
    this._.graph.setDefaultEdgeLabel(function () {
        return {};
    });

    this.effect("DAG", () => {
        this._.graph.setGraph({
            align: this.align(),
            rankdir: this.rankDir(),
        });
        DAGLayout(this._.graph);
        const box = getBox(this._.graph);
        const mapperX = mapTo(box.x, box.width, this.x(), this.width());
        const mapperY = mapTo(box.y, box.height, this.y(), this.height());
        const position = node => {
            return [mapperX(node.x), mapperY(node.y)];
        };
        this.forEachNode((node, id) => {
            const layout = this._.graph.node(id);
            this.tryUpdate(node, () => {
                node.center(position(layout));
            });
        });
        this.forEachLink((link, sourceId, targetId) => {
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            this.tryUpdate(link, () => {
                link.source(source.center());
                link.target(target.center());
                trim(link, source, target);
            });
        });
    });
}

DAG.prototype = {
    ...BaseGraph.prototype,
    align: Factory.handler("align"),
    rankDir: Factory.handler("rankDir"),
    newNode(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnterDefault(EN.appear("nodes"));
        this._.graph.setNode(id, {});
        this.__insertNode(id, element);
        return this;
    },
    newLink(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links"));
        element.value(value);
        element.onEnterDefault(EN.appear("links"));
        this._.graph.setEdge(sourceId, targetId);
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
};

function getBox(graph) {
    let x, mx, y, my;
    graph.nodes().forEach(function (info) {
        const layout = graph.node(info);
        if (x === undefined) {
            x = mx = layout.x;
            y = my = layout.y;
        } else {
            x = Math.min(x, layout.x);
            mx = Math.max(mx, layout.x);
            y = Math.min(y, layout.y);
            my = Math.max(my, layout.y);
        }
    });
    if (x === undefined) x = mx = y = my = 0;
    return { x, y, width: mx - x, height: my - y };
}
