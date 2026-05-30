import * as sd from "@/sd";

const C = sd.color();

export class WaterArray extends sd.SD2DNode {
    constructor(target, data) {
        super(target);
        const circles = [];
        data.forEach(d => {
            if (d === undefined) {
                circles.push(undefined);
                return;
            }
            const circle = new sd.Circle(this).center(pos(d)).color(C.textBlue);
            circles.push(circle);
        });
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

function pos(x) {
    return [x * 50, 0];
}
