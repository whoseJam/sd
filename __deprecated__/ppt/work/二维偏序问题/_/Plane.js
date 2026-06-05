import * as sd from "@/sd";

const C = sd.color();
const R = sd.rule();

export class Plane extends sd.FixGapCoord {
    constructor(target, data) {
        super(target);

        this.vars.merge({
            arrayGap: 0,
            elementHeight: 40,
        });

        let [minX, maxX] = [data[0][0], data[0][0]];
        let [minY, maxY] = [data[0][1], data[0][1]];
        for (let i = 0; i < data.length; i++) {
            minX = Math.min(minX, data[i][0]);
            maxX = Math.max(maxX, data[i][0]);
            minY = Math.min(minY, data[i][1]);
            maxY = Math.max(maxY, data[i][1]);
        }
        this.axis("x")
            .withTickLabel(false)
            .ticks([minX, maxX + 1, 1]);
        this.axis("y")
            .withTickLabel(false)
            .ticks([minY, maxY + 1, 1]);
        this.childAs("array", new sd.ValueArray(this).align("y"), (parent, child) => {
            child.elementWidth(parent.gap("x"));
            child.x(parent.x());
            child.y(parent.my() + this.arrayGap());
        });
        this._.maxX = maxX;
        this._.minX = minX;
        this._.maxY = maxY;
        this._.minY = minY;
        const circles = [];
        data.forEach(([x, y]) => {
            circles.push(
                this.drawCircle(x + 0.5, y + 0.5)
                    .r(6)
                    .color(C.orange)
            );
        });
        const array = this.child("array");
        array.start(minX);
        for (let i = minX; i <= maxX; i++) {
            array.push(new sd.ValueStack(array).justify("y"));
        }
        this._.circles = circles;
        this._.data = data;

        this.effect("elementHeight", () => {
            const height = this.elementHeight();
            array.forEachElement(element => {
                element.elementHeight(height);
            });
        });
    }
    countX() {
        return this._.maxX - this._.minX + 1;
    }
    countY() {
        return this._.maxY - this._.minY + 1;
    }
    minX() {
        return this._.minX;
    }
    maxX() {
        return this._.maxX;
    }
    minY() {
        return this._.minY;
    }
    maxY() {
        return this._.maxY;
    }
    circles() {
        return this._.circles;
    }
    circle(x, i) {
        return this.value(x, i).circle;
    }
    array() {
        return this.child("array");
    }
    value(x, i) {
        return this.array().element(x).element(i);
    }
    elementHeight(height) {
        if (arguments.length === 0) return this.vars.elementHeight;
        this.vars.elementHeight = height;
        return this;
    }
    arrayGap(gap) {
        if (arguments.length === 0) return this.vars.arrayGap;
        this.vars.arrayGap = gap;
        return this;
    }
}

/**
 * @param {Plane} plane
 * @param {sd.ValueArray} array
 * @param {(a: [number, number], b: [number, number]) => number} cmp
 */
export async function sortValues(plane, array, cmp) {
    await sd.pause();
    const values = [];
    const count = array.length();
    array.freeze();
    for (let i = 1; i <= count; i++) values.push(array.dropFirstElement());
    array.unfreeze();
    const planeArray = plane.array();
    const data = plane._.data;
    const circles = plane.circles();
    planeArray.startAnimate();
    for (let i = 0, j; i < values.length; i++) {
        const [x, y] = data[i];
        values[i].data = [x, y];
        values[i].circle = circles[i];
        const stack = planeArray.element(x);
        for (j = 0; j < stack.length(); j++) {
            const ck = cmp(stack.element(j).data, values[i].data);
            if (ck > 0) {
                stack.insertFromExistElement(j, values[i]);
                break;
            }
        }
        if (j === stack.length()) stack.pushFromExistElement(values[i]);
    }
    planeArray.endAnimate();
}

/**
 *
 * @param {Plane} plane
 * @param {{
 *  onMove: (x: number, y: number, i: number) => void | Promise<any>;
 *  onQuery: (x: number, y: number, i: number) => void | Promise<any>;
 *  onInsert: (x: number, y: number, i: number) => void | Promise<any>;
 * }} args
 */
export async function calculate(plane, args) {
    const onMove = args.onMove;
    const onQuery = args.onQuery;
    const onInsert = args.onInsert;
    const array = plane.array();
    for (let i = array.start(); i <= array.end(); i++) {
        const stack = array.element(i);
        for (let j = 0; j < stack.length(); j++) {
            const value = stack.element(j);
            if (onMove) await onMove(value.data[0], value.data[1], j);
            if (onQuery) await onQuery(value.data[0], value.data[1], j);
            if (onInsert) await onInsert(value.data[0], value.data[1], j);
        }
    }
}
