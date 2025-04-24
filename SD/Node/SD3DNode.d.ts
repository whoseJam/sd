import { SDNode } from "@/Node/SDNode";

export class SD3DNode extends SDNode {
    opacity(): number;
    opacity(opacity: number): this;

    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    z(): number;
    z(z: number): this;
    lx(): number;
    lx(lx: number): this;
    ly(): number;
    ly(ly: number): this;
    lz(): number;
    lz(lz: number): this;
    scale(scale: number): this;
    pos(xLocator: string, yLocator: string, zLocator: string, dx?: string, dy?: number, dz?: number): [number, number, number];
    center(): [number, number, number];
    center(center: [number, number, number]): this;
    center(cx: number, cy: number, cy: number): this;
    kx(k: number): number;
    ky(k: number): number;
    kz(k: number): number;
    dx(dx: number): this;
    dy(dy: number): this;
    dz(dz: number): this;
    cx(): number;
    cx(cx: number): this;
    cy(): number;
    cy(cy: number): this;
    cz(): number;
    cz(cz: number): this;
    mx(): number;
    mx(mx: number): this;
    my(): number;
    my(my: number): this;
    mz(): number;
    mz(mz: number): this;
}
