import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();

class MyGrid extends sd.ValueGrid {
    constructor(target) {
        super(target);

        this.uneffect("grid");

        this.effect("grid", () => {
            const x = this.x();
            const y = this.y();
            const elementWidth = this.elementWidth();
            const elementHeight = this.elementHeight();
            const elements = this.vars.elements;
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i]) continue;
                for (let j = 0; j < elements[i].length; j++) {
                    const element = elements[i][j];
                    this.tryUpdate(element, () => {
                        element.cx(x + j * elementWidth + elementWidth / 2);
                        element.my(y + i * elementHeight + elementHeight);
                    });
                }
            }
        });
    }
}

class BackpackItem extends sd.RectSVG {
    constructor(target, size, value) {
        super(target);

        this.vars.size = size;
        this.vars.value = value;

        this.color(C.ORANGE);
        this.height(size * 10).width(60);
        this.childAs("value", new sd.Text(svg, `+${value}`), R.aside("lc", 0));
    }
    intValue() {
        return this.vars.value;
    }
    size() {
        return this.vars.size;
    }
    clone() {
        return new BackpackItem(svg, this.size(), this.intValue());
    }
}

class Backpack extends sd.RectSVG {
    constructor(target, size) {
        super(target);

        this.vars.size = size;
        this.vars.elements = [];

        this.effect("backpack", () => {
            let y = this.my();
            for (const element of this.vars.elements) {
                this.tryUpdate(element, () => {
                    element.x(this.x());
                    element.my(y);
                    y -= element.height();
                });
            }
        });

        this.fillOpacity(0)
            .width(60)
            .height(size * 10);
    }
    size() {
        return this.vars.size;
    }
    push(element) {
        this.childAs(element);
        this.vars.elements.push(element);
        return this;
    }
    clone() {
        const backpack = new Backpack(this, size);
        for (const element of this.vars.elements) {
            backpack.push(element.clone());
        }
        return backpack;
    }
    copyFrom(backpack) {
        for (const element of backpack.vars.elements) {
            this.push(element.clone());
        }
        return this;
    }
}

const grid = new MyGrid(svg).elementWidth(120).elementHeight(120);
const values = [3, 2, 5, 4];
const sizes = [1, 3, 2, 3];
const n = sizes.length;
const size = 8;
const dp = sd.make2d(n + 5, size + 5);

sd.init(() => {
    grid.insert(0, 0, empty());
    for (let i = 1; i <= size; i++) {
        grid.insert(0, i, new sd.Text(svg, `背包体积${i}`));
    }
    for (let i = 1; i <= values.length; i++) {
        const item = new BackpackItem(svg, sizes[i - 1], values[i - 1]);
        sd.Label(item, `体积${sizes[i - 1]}`, "tc", 15, 0);
        grid.insert(i, 0, item);
    }
});

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= size; j++) {
            await sd.pause();
            const backpack = new Backpack(svg, j);
            grid.startAnimate().insert(i, j, backpack).endAnimate();
            const v1 = dp[i - 1][j];
            const v2 = j - sizes[i - 1] >= 0 ? dp[i - 1][j - sizes[i - 1]] + values[i - 1] : 0;
            dp[i][j] = Math.max(v1, v2);
            if (i === 1) {
                if (v2) {
                    await sd.pause();
                    backpack
                        .startAnimate()
                        .push(new BackpackItem(backpack, sizes[i - 1], values[i - 1]))
                        .endAnimate();
                }
            } else {
                let label, link;
                if (v1 > v2) {
                    await sd.pause();
                    label = grid.element(i - 1, j);
                    if (label.hasChild("label")) label = label.child("label");
                    link = new sd.Line(svg).source(label.pos("cx", "my")).target(grid.element(i, j).pos("cx", "y")).startAnimate().pointStoT().endAnimate().arrow();
                    await sd.pause();
                    backpack
                        .startAnimate()
                        .copyFrom(grid.element(i - 1, j))
                        .endAnimate();
                } else {
                    await sd.pause();
                    label = grid.element(i - 1, j - sizes[i - 1]);
                    if (label.hasChild("label")) label = label.child("label");
                    link = new sd.Line(svg).source(label.pos("cx", "my")).target(grid.element(i, j).pos("cx", "y")).startAnimate().pointStoT().endAnimate().arrow();
                    await sd.pause();
                    backpack.startAnimate();
                    if (j - sizes[i - 1] >= 1) backpack.copyFrom(grid.element(i - 1, j - sizes[i - 1]));
                    backpack.push(new BackpackItem(backpack, sizes[i - 1], values[i - 1]));
                    backpack.endAnimate();
                }
                await sd.pause();
                link.startAnimate().opacity(0.2).endAnimate();
            }
            await sd.pause();
            const label = new sd.Text(backpack, dp[i][j]);
            backpack.startAnimate().childAs("label", label, R.aside("bc", 0)).endAnimate();
        }
    }
});

function empty() {
    return new sd.Rect(svg).opacity(0).onEnter(EN.nothing());
}
