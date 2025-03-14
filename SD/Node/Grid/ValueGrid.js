import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { Grid } from "@/Node/Grid/Grid";

export function ValueGrid(parent) {
    Grid.call(this, parent);

    this.type("ValueGrid");

    this.uneffect("grid");
    this.effect("valueGrid", () => {
        const x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.vars.elements;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i]) continue;
            for (let j = 0; j < elements[i].length; j++) {
                const element = elements[i][j];
                this.tryMove(element, () => {
                    element.cx(x + j * elementWidth + elementWidth / 2);
                    element.cy(y + i * elementHeight + elementHeight / 2);
                });
            }
        }
    });
}

ValueGrid.prototype = {
    ...Grid.prototype,
    insert(i, j, value) {
        const element = value;
        element.onEnterDefault(EN.appear("elements"));
        element.onExitDefault(EX.fade());
        this.insertByBaseGrid(i, j, element);
        return this;
    },
};
