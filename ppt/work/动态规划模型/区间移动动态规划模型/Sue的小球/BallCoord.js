import * as sd from "@/sd";

const C = sd.color();

export class BallCoord extends sd.SD2DNode {
    constructor(target, balls) {
        super(target);
        const circles = [];
        balls.forEach(ball => {
            if (ball === undefined) {
                circles.push(undefined);
                return;
            }
            const circle = new sd.Circle(this).center(pos(ball)).color(C.cyan);
            circle.childAs("arrow", new sd.Line(circle).arrow(), function (parent, child) {
                child.source(parent.pos("cx", "my"));
                child.target(parent.pos("cx", "my", 0, 20));
            });
            circles.push(circle);
        });
        new sd.Line(this)
            .source(0, 50)
            .target(balls[balls.length - 1][0] * 50 + 50, 50)
            .arrow();
        new sd.Line(this)
            .source(0, 50)
            .target(0, -30 * 8)
            .arrow();
        this.vars.elements = circles;
    }
    start() {
        return 0;
    }
    end() {
        return this.vars.elements.length - 1;
    }
    element(i) {
        return this.vars.elements[i];
    }
}

function pos(vec) {
    return [vec[0] * 50, -30 * vec[1]];
}
