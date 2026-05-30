import { SDSVGNode } from "@/Node/SDSVGNode";
import { Percent } from "@/Node/SDNode";

export class BaseFilter extends SDSVGNode {
    _: SDSVGNode["_"] & {
        x: Percent;
        y: Percent;
        width: Percent;
        height: Percent;
    };

    getX() {
        return this._.x as any;
    }

    getY() {
        return this._.y as any;
    }

    getWidth() {
        return this._.width as any;
    }

    getHeight() {
        return this._.height as any;
    }
}
