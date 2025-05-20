import { BaseThree } from "@/Node/Three/BaseThree";

export class BaseCamera extends BaseThree {
    near(): number;
    near(near: number): this;
    far(): number;
    far(far: number): this;
    resize(width: number, height: number): this;
    lookAt(x: number, y: number, z: number): this;
    direction(): [number, number, number];
    direction(direction: [number, number, number]): this;
    direction(x: number, y: number, z: number): this;
}
