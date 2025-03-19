import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

export function svg(): SVGNode;
export function div(): HTMLNode;

export class Root {
    static init();
    static setViewBox(x: number, y: number, width: number, height: number, rate: number);
}
