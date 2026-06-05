import * as sd from "@/sd";

export class Matrix extends sd.ValueGrid {
    constructor(target, data) {
        super(target);

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                this.insert(i, j, new sd.Math(this, data[i][j]));
            }
        }
        this.childAs(new sd.ZZLine(this).location("l").bending(5), (parent, child) => {
            child.source(parent.x() + 3, parent.y());
            child.target(parent.x() + 3, parent.my());
        });
        this.childAs(new sd.ZZLine(this).location("r").bending(5), (parent, child) => {
            child.source(parent.mx() - 3, parent.y());
            child.target(parent.mx() - 3, parent.my());
        });
    }
}
