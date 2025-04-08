import { BaseGraph } from "@/Node/Graph/BaseGraph";

export class GridGraph extends BaseGraph {
    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;
    at(i: number, j: number): this;
}
