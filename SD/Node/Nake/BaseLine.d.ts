import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";

export class BaseLine extends BaseNake {
    constructor(parent: SDNode | RenderNode, tag: string);

    /**
     * 获取线头标记
     */
    markerStart(): string;

    /**
     * 设置线头标记
     * @param marker
     */
    markerStart(marker: string): this;

    /**
     * 获取线中标记
     */
    markerMid(): string;

    /**
     * 设置线中标记
     * @param marker
     */
    markerMid(marker: string): this;

    /**
     * 获取线尾标记
     */
    markerEnd(): string;

    /**
     * 设置线尾标记
     * @param marker
     */
    markerEnd(marker: string): this;

    /**
     * 设置箭头
     * @param flag
     */
    arrow(flag: boolean | undefined | null): this;

    /**
     * 设置反向箭头
     * @param flag
     */
    revArrow(flag: boolean | undefined | null): this;

    /**
     * 设置双向箭头
     * @param flag
     */
    doubleArrow(flag: boolean | undefined | null): this;

    /**
     * 起点连向终点
     */
    pointStoT(): this;

    /**
     * 终点连向起点
     */
    pointTtoS(): this;

    /**
     * 起点消失到终点
     */
    fadeStoT(): this;

    /**
     * 终点消失到起点
     */
    fadeTtoS(): this;

    /**
     * 获取起点
     */
    source(): [number, number];

    /**
     * 设置起点
     * @param vector
     */
    source(vector: [number, number]): this;

    /**
     * 设置起点
     * @param x
     * @param y
     */
    source(x: number, y: number): this;

    /**
     * 获取终点
     */
    target(): [number, number];

    /**
     * 设置终点
     * @param vector
     */
    target(vector: [number, number]): this;

    /**
     * 设置终点
     * @param x
     * @param y
     */
    target(x: number, y: number): this;

    /**
     * 获取起点 x 坐标
     */
    x1(): number;

    /**
     * 设置起点 x 坐标
     * @param x
     */
    x1(x: number): this;

    /**
     * 获取终点 x 坐标
     */
    x2(): number;

    /**
     * 设置终点 x 坐标
     * @param x
     */
    x2(x: number): this;

    /**
     * 获取起点 y 坐标
     */
    y1(): number;

    /**
     * 设置起点 y 坐标
     * @param y
     */
    y1(y: number): this;

    /**
     * 获取终点 y 坐标
     */
    y2(): number;

    /**
     * 设置终点 y 坐标
     * @param y
     */
    y2(y: number): this;

    /**
     * 获取 k 分位点
     * @param k
     */
    at(k: number): Vector;

    /**
     * 获取距离起点长度为 length 的点
     * @param length
     */
    getPointAtLength(length: number): Vector;

    /**
     * 获取总长度
     */
    totalLength(): number;

    /**
     * 获取价值物的文本
     */
    text(): string;

    /**
     * 丢弃价值物
     */
    drop(): this;

    /**
     * 将价值物转为 int
     */
    intValue(): number;

    /**
     * 获取价值物
     */
    value(): SDNode;

    /**
     * 设置价值物
     * @param value
     */
    value(value: SDNode): this;

    /**
     * 设置价值物
     * @param value
     * @param rule
     */
    value(value: SDNode, rule: SDRule): this;

    /**
     * 设置价值物
     * @param value
     */
    valueFromExist(value: SDNode): this;

    /**
     * 设置价值物
     * @param value
     * @param rule
     */
    valueFromExist(value: SDNode, rule: SDRule): this;
}
