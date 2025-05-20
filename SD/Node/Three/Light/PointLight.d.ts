import { BaseLight } from "@/Node/Three/Light/BaseLight";

export class PointLight extends BaseLight {
    distance(): number;
    distance(distance: number): this;
    decay(): number;
    decay(decay: number): this;
}
