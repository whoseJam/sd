import * as sd from "@/sd";

const R = sd.rule();

export class LinkWithNode extends sd.Line {
    constructor(target, x, y, v) {
        super(target);
        this.source(0, 0).target(80, 0);
        this.value(v, R.pointAtPathByRate(0.5, "cx", "my", 0, -3));
        this.childAs("x", new sd.Vertex(this, x), R.pointAtPathByRate(0));
        this.childAs("y", new sd.Vertex(this, y), R.pointAtPathByRate(1));
    }
}
