import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";

export class SDNode {
    _: Record<string, any>;

    constructor(target: SDNode | RenderNode);

    type(): string | undefined;
    type(type: string): this;
    fixAspect(): boolean;

    layer(): RenderNode;
    layer(name: string): RenderNode;
    newLayer(name: string): this;
    attachTo(target: SDNode | RenderNode): this;

    childAs(name?: string | number, child: SDNode, rule?: SDRule): this;
    child(name: string | number): SDNode;
    hasChild(child: string | number | SDNode): boolean;
    eraseChild(child: string | number | SDNode): SDNode | undefined;
    remove(): this;

    startAnimate(duration?: number): this;
    startAnimate(other: SDNode): this;
    startAnimate(start: number, end: number): this;
    endAnimate(): this;
    isAnimating(): boolean;
    delay(): number;
    after(delay: number | SDNode): this;
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

    drag(type: true | false | null | undefined): this;
    drag(onDrag: (dx: number, dy: number) => [number, number]): this;
    clickable(type: true | false | null | undefined): this;
    click(): this;
    onClick(onClick: false | null | undefined): this;
    onClick(onClick: (node: this) => void): this;
    dblClick(): this;
    onDblClick(onClick: false | null | undefined): this;
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
