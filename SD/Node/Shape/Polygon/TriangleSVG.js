import { PolygonSVG } from "@/Node/Shape/PolygonSVG";

export class TriangleSVG extends PolygonSVG {
    constructor(target) {
        super(target, [
            [20, 0],
            [0, 20 * Math.sqrt(3)],
            [40, 20 * Math.sqrt(3)],
        ]);

        this.type("TriangleSVG");
    }
}
