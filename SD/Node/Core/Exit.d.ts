import { SDNode } from "@/Node/SDNode";

export class Exit {
    static fade(): (element: SDNode) => void;

    static drop(): (element: SDNode) => void;
}

export function exit(): typeof Exit;
