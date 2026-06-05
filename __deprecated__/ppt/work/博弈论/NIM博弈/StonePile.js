import * as sd from "@/sd";

const EN = sd.enter();
const C = sd.color();

export class StonePile extends sd.ValuePile {
    constructor(parent, count) {
        super(parent);
        this.elementHeight(50);
        for (let i = 1; i <= count; i++) this.push();
        const stonePile = this;
        const pool = new sd.ArrayPool({
            onIdle(resource) {
                resource.opacity(0);
            },
            getIdle(resource) {
                return resource.onEnter(EN.appear());
            },
            getUsed(resource) {
                return resource.onEnter(EN.moveTo());
            },
            onCreate() {
                const split = new sd.Rect(stonePile).fillOpacity(0).strokeOpacity(1).strokeWidth(3).stroke(C.red).clickable(false);
                stonePile.childAs(split);
                return split;
            },
        });
        this.effect("binarySplit", () => {
            const n = this.length();
            pool.beforeAllocate();
            let l = 0;
            let r = 0;
            for (let i = 10; i >= 0; i--) {
                if ((n >> i) & 1) {
                    r = l + (1 << i) - 1;
                    const split = pool.allocate();
                    this.tryUpdate(split, () => {
                        const e1 = this.element(l);
                        const e2 = this.element(r);
                        split.width(this.width() + 10);
                        split.height((1 << i) * this.elementHeight());
                        split.cx(this.cx()).cy((e2.y() + e1.my()) / 2);
                    });
                    l = r + 1;
                }
            }
            pool.afterAllocate();
        });
    }
    push() {
        const circle = new sd.Circle(this).opacity(0).color(C.grey).onEnter(EN.appear());
        super.pushFromExistElement(circle);
    }
}
