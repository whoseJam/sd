import { BaseAxis } from "@/Node/Axis/BaseAxis";

type Ticks = "linear" | number;
type TickAlign = "center" | "source" | "target";
type TickLabelAlign = "source" | "target";

class Axis extends BaseAxis {
    length(): number;
    length(length: number): this;
    direction(): Direction;
    direction(x: number, y: number): this;
    direction(direction: "horizontal" | "vertical" | [number, number]): this;
    withTick(): boolean;
    withTick(withTick: boolean): this;
    withTickLabel(): boolean;
    withTickLabel(withTickLabel: boolean): this;
    tickLength(): number;
    tickLength(length: number): this;
    tickAlign(): TickAlign;
    tickAlign(align: TickAlign);
    fontSize(): number;
    fontSize(fontSize: number): this;
    tickLabelAlign(): TickLabelAlign;
    tickLabelAlign(align: TickLabelAlign): this;
}
