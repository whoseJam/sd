import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";

export class OrthgraphicCamera extends BaseCamera {
    left(): number;
    left(left: number): this;
    right(): number;
    right(right: number): this;
    top(): number;
    top(top: number): this;
    bottom(): number;
    bottom(bottom: number): this;
}
