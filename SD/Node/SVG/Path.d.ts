import { BaseSVGLine } from "@/Node/SVG/BaseSVGLine";

export class Path extends BaseSVGLine {
    d(): string;
    d(d: string): this;
}
