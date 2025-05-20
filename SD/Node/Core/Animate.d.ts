import { SDNode } from "@/Node/SDNode";

export class Animate {
    constructor(parent: SDNode);
    check(): void;
    startAnimate(): void;
    startAnimate(duration: number): void;
    startAnimate(other: SDNode): void;
    startAnimate(start: number, end: number): void;
    endAnimate(): void;
    isAnimating(): boolean;
    delay(): number;
    after(delay: number): void;
    after(other: SDNode): void;
    duration(): number;
}
