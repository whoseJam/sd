import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class BaseSVG extends SD2DNode {
    constructor(target: SDNode | RenderNode, tag: string);

    /**
     * 获取填充色
     */
    fill(): HexColor;

    /**
     * 设置填充色
     * @param fill
     */
    fill(fill: SDColor): this;

    /**
     * 获取填充透明度
     */
    fillOpacity(): number;

    /**
     * 设置填充透明度
     * @param opacity
     */
    fillOpacity(opacity: number): this;

    /**
     * 设置描边色
     */
    stroke(): HexColor;

    /**
     * 设置描边色
     * @param stroke
     */
    stroke(stroke: SDColor): this;

    /**
     * 获取描边透明度
     */
    strokeOpacity(): number;

    /**
     * 设置描边透明度
     * @param opacity
     */
    strokeOpacity(opacity: number): this;

    /**
     * 获取描边宽度
     */
    strokeWidth(): number;

    /**
     * 设置描边宽度
     * @param width
     */
    strokeWidth(width: number): this;

    /**
     * 获取描边短线偏移
     */
    strokeDashOffset(): number;

    /**
     * 设置描边短线偏移
     * @param offset
     */
    strokeDashOffset(offset: number): this;

    /**
     * 获取描边短线数组
     */
    strokeDashArray(): Array<number>;

    /**
     * 设置描边短线数组
     * @param array
     */
    strokeDashArray(array: Array<number>): this;

    /**
     * 获取颜色
     */
    color(): PacketColor;

    /**
     * 设置颜色
     * @param color
     */
    color(color: SDColor): this;
}
