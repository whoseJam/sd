import { RenderNode } from "@/Renderer/RenderNode";

type EnterCallback = (element: SDNode, move: () => void) => void;

export class SDNode {
    constructor(parent: SDNode);
    constructor(parent: SDNode, layer: RenderNode);
    type(type: string): this;
    layer(): RenderNode;
    layer(name: string): RenderNode;
    newLayer(name: string): this;
    layer(name: string): RenderNode;
    attachTo(layer: SDNode): this;
    attachTo(layer: RenderNode): this;

    /**
     * 设置某节点为当前节点的子节点
     * @param name
     * @param child
     * @param rule
     */
    childAs(name: string, child: SDNode, rule: Rule): this;

    /**
     * 设置某节点为当前节点的子节点
     * @param name
     * @param child
     */
    childAs(name: string, child: SDNode): this;

    /**
     * 设置某节点为当前节点的子节点
     * @param child
     * @param rule
     */
    childAs(child: SDNode, rule: Rule): this;

    /**
     * 设置某节点为当前节点的子节点
     * @param child
     */
    childAs(child: SDNode): this;

    /**
     * 获取某个子节点
     * @param name
     */
    child(name: string): SDNode;

    /**
     * 判断子节点是否存在
     * @param child
     */
    hasChild(child: string | SDNode): SDNode;

    /**
     * 删除某个子节点
     * @param name
     */
    eraseChild(name: string): SDNode;

    /**
     * 删除某个子节点
     * @param child
     */
    eraseChild(child: SDNode): SDNode;

    /**
     * 开启一段动画
     * @param duration
     */
    startAnimate(duration: number): this;

    /**
     * 开启一段动画
     * @param other
     */
    startAnimate(other: SDNode): this;

    /**
     * 开启一段动画
     * @param start
     * @param end
     */
    startAnimate(start: number, end: number): this;

    /**
     * 开启一段动画
     */
    startAnimate(): this;

    /**
     * 结束一段动画
     */
    endAnimate(): this;

    /**
     * 是否处于动画中
     */
    isAnimating(): boolean;

    /**
     * 获取当前动画延时
     */
    delay(): number;

    /**
     * 设置当前动画延时
     * @param delay
     */
    after(delay: number): this;

    /**
     * 设置当前动画延时
     * @param other
     */
    after(other: SDNode): this;

    /**
     * 获取当前动画时长
     */
    duration(): number;

    /**
     * 获取元素透明度
     */
    opacity(): number;

    /**
     * 设置元素透明度
     * @param opacity
     */
    opacity(opacity: number): this;

    /**
     * 判断某个坐标是否位于元素的包围盒内
     * @param point
     */
    inRange(point: [number, number]): boolean;

    /**
     * 删除该元素
     */
    remove(): void;

    /**
     * 获取元素 x 坐标
     */
    x(): number;

    /**
     * 设置元素 x 坐标
     * @param x
     */
    x(x: number): this;

    /**
     * 获取元素 y 坐标
     */
    y(): number;

    /**
     * 设置元素 y 坐标
     * @param y
     */
    y(y: number): this;

    /**
     * 获取元素宽度
     */
    width(): number;

    /**
     * 设置元素宽度
     * @param width
     */
    width(width: number): this;

    /**
     * 获取元素高度
     */
    height(): number;

    /**
     * 设置元素高度
     * @param height
     */
    height(height: number): this;

    /**
     * 将元素等比缩放
     * @param scale
     */
    scale(scale: number): this;

    /**
     * 获取元素上的某个点
     * @param xLocator
     * @param yLocator
     * @param dx
     * @param dy
     */
    pos(xLocator: string, yLocator: string, dx: number, dy: number): [number, number];

    /**
     * 获取元素的中点
     */
    center(): [number, number];

    /**
     * 设置元素的中点
     * @param center
     */
    center(center: [number, number]): this;

    /**
     * 设置元素的中点
     * @param cx
     * @param cy
     */
    center(cx: number, cy: number): this;

    /**
     * 获取元素 x 方向上的 k 分位点
     * @param k
     */
    kx(k: number): number;

    /**
     * 获取元素 y 方向上的 k 分位点
     * @param k
     */
    ky(k: number): number;

    /**
     * 获取元素 x 方向上的中点
     */
    cx(): number;

    /**
     * 设置元素 x 方向上的中点
     * @param cx
     */
    cx(cx: number): this;

    /**
     * 获取元素 y 方向上的中点
     */
    cy(): number;

    /**
     * 设置元素 y 方向上的中点
     * @param cy
     */
    cy(cy: number): this;

    /**
     * 将元素在 x 方向上位移一段距离
     * @param dx
     */
    dx(dx: number): this;

    /**
     * 将元素在 y 方向上位移一段距离
     * @param dy
     */
    dy(dy: number): this;

    /**
     * 获取元素最大 x 坐标
     */
    mx(): number;

    /**
     * 设置元素最大 x 坐标
     * @param mx
     */
    mx(mx: number): this;

    /**
     * 获取元素最大 y 坐标
     */
    my(): number;

    /**
     * 设置元素最大 y 坐标
     * @param my
     */
    my(my: number): this;

    /**
     * 冻结元素状态
     */
    freeze(): this;

    /**
     * 解冻元素状态
     */
    unfreeze(): this;

    /**
     * 判断元素是否处于冻结中
     */
    freezing(): boolean;

    /**
     * 设置元素可拖动
     * @param type
     */
    drag(type: true): this;

    /**
     * 设置元素不可拖动
     * @param type
     */
    drag(type: false | null | undefined);

    /**
     * 设置元素可拖动
     * @param onDrag
     */
    drag(onDrag: (dx: number, dy: number) => [number, number]): this;

    /**
     * 设置元素可点击
     * @param type
     */
    clickable(type: true): this;

    /**
     * 设置元素不可点击
     * @param type
     */
    clickable(type: false | null | undefined);

    /**
     * 设置元素点击回调
     * @param onClick
     */
    onClick(onClick: (node: this) => void): this;

    /**
     * 设置元素双击回调
     * @param onClick
     */
    onDblClick(onClick: (node: this) => void): this;

    /**
     * 获取元素的 rule
     */
    rule(): (parent: SDNode, child: SDNode) => void;

    /**
     * 设置元素的 rule
     * @param rule
     */
    rule(rule: (parent: SDNode, child: SDNode) => void): this;

    /**
     * 设置元素的 enter 回调
     * @param enter
     */
    onEnter(enter: (element: SDNode, move: () => void) => void): this;

    /**
     * 获取元素的 enter 回调
     */
    onEnter(): (element: SDNode) => void | undefined;

    /**
     * 设置元素的默认 enter 回调
     * @param enter
     */
    onEnterDefault(enter: (element: SDNode, move: () => void) => void): this;

    /**
     * 触发元素的 enter 回调
     */
    triggerEnter(): this;

    /**
     * 判断元素是否正在进入父元素
     */
    entering(): boolean;

    /**
     * 获取元素的 exit 回调
     */
    onExit(): (element: SDNode) => void | undefined;

    /**
     * 设置元素的 exit 回调
     * @param exit
     */
    onExit(exit: (element: SDNode) => void): this;

    /**
     * 设置元素的默认 exit 回调
     * @param exit
     */
    onExitDefault(exit: (element: SDNode) => void): this;

    /**
     * 触发元素的 exit 回调
     */
    triggerExit(): this;

    /**
     * TODO
     * @param title
     */
    title(title: string): this;
}
