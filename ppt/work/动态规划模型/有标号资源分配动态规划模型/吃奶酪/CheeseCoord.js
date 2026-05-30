import * as sd from "@/sd";

export class CheeseCoord extends sd.FixGapCoord {
    constructor(target, data) {
        super(target);
        this.gap("x", 50);
        this.gap("y", 50);
        this.ticks("x", [-2, 6, 1]);
        this.ticks("y", [-2, 2, 1]);
        const circles = [];
        data.forEach((point, i) => {
            const circle = new sd.Vertex(this, i + 1).r(15);
            this.childAs(circle, (parent, child) => {
                child.center(parent.global(point));
            });
            circles.push(circle);
        });
        this.vars.elements = circles;
    }
    element(i) {
        return this.vars.elements[i];
    }
}
