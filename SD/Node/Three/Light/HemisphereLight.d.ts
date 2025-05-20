import { BaseLight } from "@/Node/Three/Light/BaseLight";
import { HexColor } from "@/Utility/Color";

export class HemisphereLight extends BaseLight {
    skyColor(): HexColor;
    skyColor(color: HexColor): this;
    groundColor(): HexColor;
    groundColor(color: HexColor): this;
}
