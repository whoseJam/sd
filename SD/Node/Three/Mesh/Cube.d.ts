import { SD3DNode } from "@/Node/SD3DNode";
import { SDColor } from "@/Utility/Color";

export class Cube extends SD3DNode {
    color(): SDColor;
    color(color: SDColor): this;
}
