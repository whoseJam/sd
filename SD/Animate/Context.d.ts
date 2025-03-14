import { SDNode } from "@/Node/SDNode";

export class Context {
    constructor(parent: SDNode);
    till(l: number, r: number): void;
    tillc(l: number, r: number): SDNode;
    recover(): void;
}
