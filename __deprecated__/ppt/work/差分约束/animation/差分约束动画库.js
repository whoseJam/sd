import * as sd from "@/sd";

/**
 * @param {sd.GraphBase} graph 
 * @param {"minDistance"|"maxDistance"} mode
 * @param {number|string|undefined} S 
 * @returns {boolean}
 */
export function SpfaWithoutAnimation(graph, mode, S) {
    const nodesId = graph.nodesId();
    const Q = [];
    const n = nodesId.length;
    if (S === undefined) {
        nodesId.forEach(nodeId => {
            const node = graph.element(nodeId);
            node.dis = 0;
            node.inq = 1;
            node.tim = 0;
            Q.push(nodeId);
        });
    } else {
        nodesId.forEach(nodeId => {
            const node = graph.element(nodeId);
            node.dis = (mode === "minDistance") ? Infinity : -Infinity;
            node.inq = 0;
            node.tim = 0;
        })
        console.log("insert only S=",S);
        const nodeS = graph.element(S);
        nodeS.dis = 0;
        nodeS.inq = 1;
        Q.push(S);
    }
    while(Q.length >= 1) {
        const u = Q[0];
        Q.shift();
        const outLinks = graph.outLinks(u);
        for (let link of outLinks) {
            const v = link.toNodeId;
            const nodeU = graph.element(u);
            const nodeV = graph.element(v);
            const condition = () => {
                if (mode === "minDistance") return nodeV.dis > nodeU.dis + link.intValue();
                return nodeV.dis < nodeU.dis + link.intValue();
            }
            if (condition()) {
                nodeV.dis = nodeU.dis + link.intValue();
                if (!nodeV.inq) {
                    nodeV.inq = 1;
                    if ((++nodeV.tim) >= n) return true;
                    Q.push(v);
                }
            }
        }
    }
    return false;
}