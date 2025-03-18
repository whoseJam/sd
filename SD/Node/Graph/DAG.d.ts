import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type RankDir = "TB" | "BT" | "LR" | "RL";
type Align = "UL" | "UR" | "DL" | "DR" | "C";

export class DAG extends BaseGraph {
    constructor(target: SDNode | RenderNode);
    rankDir(): RankDir;
    rankDir(rankDir: RankDir): this;
    align(): Align;
    align(align: Align): this;
}
