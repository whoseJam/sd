import { mapTo } from "@/Math/Math";
import { Box } from "@/Node/Element/Box";
import { DAG } from "@/Node/Graph/DAG";
import { Factory } from "@/Utility/Factory";
import { layout as DAGLayout } from "dagre";

export class BoxDAG extends DAG {
    constructor(target) {
        super(target);

        this.type("BoxDAG");

        this.vars.merge({
            elementWidth: 40,
            elementHeight: 40,
        });

        this._.nodeType = Box;
        const graph = this._.graph;

        this.uneffect("nodes");
        this.effect("nodes", () => {
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
            this.forEachNode((node, nodeId) => {
                const layout = this._.graph.node(nodeId);
                this.tryUpdate(node, () => {
                    node.width(this.elementWidth());
                    node.height(this.elementHeight());
                    node.center(position(layout));
                });
            });
        });
    }
}

Object.assign(BoxDAG.prototype, {
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
});

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
