import { Enter as EN } from "@/Node/Core/Enter";
import { Box } from "@/Node/Element/Box";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { Factory } from "@/Utility/Factory";

function offsetN() {
    return 0;
}

function offsetC(m, length) {
    return (m - length) / 2;
}

function offsetM(m, length) {
    return m - length;
}

export class Grid extends BaseGrid {
    constructor(target) {
        super(target);

        this.type("Grid");

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
            width: 0,
            height: 0,
            main: "row",
            align: "x",
        });

        this.effect("grid", () => {
            const dict = {
                x: this.x(),
                y: this.y(),
                mx: this.mx(),
                my: this.my(),
                lx: this.elementWidth(),
                ly: this.elementHeight(),
            };
            const elements = this.vars.elements;
            const main = this.axis();
            const align = this.align();
            const mainAxis = main === "row" ? "y" : "x";
            const auxiAxis = main === "row" ? "x" : "y";
            const m = this.m();
            const offset = align === "x" || align === "y" ? offsetN : align === "cx" || align === "cy" ? offsetC : offsetM;
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i]) continue;
                for (let j = 0; j < elements[i].length; j++) {
                    const element = elements[i][j];
                    this.tryUpdate(element, () => {
                        element.width(dict["lx"]);
                        element.height(dict["ly"]);
                        element[mainAxis](dict[mainAxis] + i * dict[`l${mainAxis}`]);
                        element[auxiAxis](dict[auxiAxis] + (offset(m, elements[i].length) + j) * dict[`l${auxiAxis}`]);
                    });
                }
            }
        });
    }
}

Object.assign(Grid.prototype, {
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width(width) {
        const label = this.vars.main === "row" ? "m" : "n";
        if (width === undefined) return this[label]() * this.elementWidth();
        const length = this[label]() ? this[label]() : 1;
        this.elementWidth(width / length);
        return this;
    },
    height(height) {
        const label = this.vars.main === "row" ? "n" : "m";
        if (height === undefined) return this[label]() * this.elementHeight();
        const length = this[label]() ? this[label]() : 1;
        this.elementHeight(height / length);
        return this;
    },
    insert(i, j, value) {
        const element = new Box(this.layer("elements"), value).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(i, j, element);
        return this;
    },
    insertFromExistValue(i, j, value) {
        const element = new Box(this.layer("elements")).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(i, j, element);
        element.valueFromExist(value);
        return this;
    },
    insertFromExistElement(i, j, element) {
        element.onEnter(EN.moveTo("elements"));
        this.__insert(i, j, element);
        return this;
    },
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
    axis: Factory.handlerLowPrecise("main"),
    align: Factory.handlerLowPrecise("align"),
});
