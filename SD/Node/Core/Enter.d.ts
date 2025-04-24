import { SDNode } from "@/Node/SDNode";

export class Enter {
    static appear(): (element: SDNode, move: () => void) => void;
    static appear(layer: string): (element: SDNode, move: () => void) => void;
    static pointStoT(): (element: SDNode, move: () => void) => void;
    static pointStoT(layer: string): (element: SDNode, move: () => void) => void;
    static moveTo(): (element: SDNode, move: () => void) => void;
    static moveTo(layer: string): (element: SDNode, move: () => void) => void;
}

export function enter(): typeof Enter;
