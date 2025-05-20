import { BaseShape3D } from "@/Node/Three/Shape/BaseShape3D";

export class Rect3D extends BaseShape3D {
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
}
