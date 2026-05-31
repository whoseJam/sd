import { SDSVGNode } from "@/Node/SDSVGNode";
import { Percent } from "@/Node/SDNode";

export class BaseFilter extends SDSVGNode {
    /* model fields:

        x: Percent;
        y: Percent;
        width: Percent;
        height: Percent;
        */

    getX() {
        return this.x as any;
    }

    getY() {
        return this.y as any;
    }

    getWidth() {
        return this.width as any;
    }

    getHeight() {
        return this.height as any;
    }
}
