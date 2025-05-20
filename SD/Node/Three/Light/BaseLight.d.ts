import { BaseThree } from "@/Node/BaseThree";
import { HexColor } from "@/Utility/Color";

export class BaseLight extends BaseThree {
    color(): HexColor;
    color(color: HexColor): this;
    intensity(): number;
    intensity(intentsity: number): this;
}
