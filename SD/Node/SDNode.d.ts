import { RenderNode } from "@/Renderer/RenderNode";

export class SDNode {
    constructor(target: SDNode | RenderNode);

    type(type: string): this;
    fixAspect(): boolean;

    layer(): RenderNode;
    layer(name: string): RenderNode;
    newLayer(name: string): this;
    attachTo(target: SDNode): this;
    attachTo(target: RenderNode): this;

    childAs(name: string, child: SDNode, rule: Rule): this;
    childAs(name: string, child: SDNode): this;
    childAs(child: SDNode, rule: Rule): this;
    childAs(child: SDNode): this;
    child(name: string): SDNode;
    hasChild(child: string | SDNode): SDNode;
    eraseChild(child: string | SDNode): SDNode;
    remove(): void;

    startAnimate(duration: number): this;
    startAnimate(other: SDNode): this;
    startAnimate(start: number, end: number): this;
    startAnimate(): this;
    endAnimate(): this;
    isAnimating(): boolean;
    delay(): number;
    after(delay: number): this;
    after(other: SDNode): this;
    duration(): number;

    freeze(): this;
    unfreeze(): this;
    freezing(): boolean;
    rule(): (parent: SDNode, child: SDNode) => void;
    rule(rule: (parent: SDNode, child: SDNode) => void): this;
    eraseRule(): this;
    effect(name: string, callback: () => void): this;
    uneffect(name: string): this;
    uneffectAll(): this;
    triggerEffect(): this;

    drag(type: true): this;
    drag(type: false | null | undefined);
    drag(onDrag: (dx: number, dy: number) => [number, number]): this;
    clickable(type: true): this;
    clickable(type: false | null | undefined);
    onClick(onClick: (node: this) => void): this;
    onDblClick(onClick: (node: this) => void): this;

    onEnter(): (element: SDNode) => void | undefined;
    onEnter(enter: (element: SDNode, move: () => void) => void): this;
    onEnterDefault(enter: (element: SDNode, move: () => void) => void): this;
    triggerEnter(): this;
    entering(): boolean;
    onExit(): (element: SDNode) => void | undefined;
    onExit(exit: (element: SDNode) => void): this;
    onExitDefault(exit: (element: SDNode) => void): this;
    triggerExit(): this;
}
