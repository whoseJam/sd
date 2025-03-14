import { Dom } from "@/Dom/Dom";
import { Check } from "@/Utility/Check";

export class Interact {
    constructor(parent) {
        this.parent = parent;
        this.onclick = undefined;
        this.ondblclick = undefined;
        this.timeout = undefined;
    }
    onClick(callback) {
        const nake = this.parent._.layer.nake();
        Dom.removeEventListener(nake, "click", this.onclick);
        this.onclick = () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                callback(this.parent);
            }, 200);
        };
        Dom.addEventListener(nake, "click", this.onclick);
        return this;
    }
    onDblClick(callback) {
        const nake = this.parent._.layer.nake();
        Dom.removeEventListener(nake, "dblclick", this.ondblclick);
        this.ondblclick = () => {
            clearTimeout(this.timeout);
            callback(this.parent);
        };
        Dom.addEventListener(nake, "dblclick", this.ondblclick);
        return this;
    }
    drag(arg) {
        const nake = this.parent._.layer.nake();
        if (Check.isFalseType(arg)) {
            Snap(nake).undrag();
            return this;
        }
        let currentX = 0;
        let currentY = 0;
        let lastDx = 0;
        let lastDy = 0;
        Snap(nake).drag(
            function (dx, dy) {
                let screenDx = (dx - lastDx) / window.RATE;
                let screenDy = (dy - lastDy) / window.RATE;
                if (typeof arg === "function") {
                    [screenDx, screenDy] = arg(screenDx, screenDy);
                }
                lastDx = dx;
                lastDy = dy;
                currentX += screenDx;
                currentY += screenDy;
                const transform = `matrix(1,0,0,1,${currentX},${currentY})`;
                nake.setAttribute("transform", transform);
            },
            function () {
                if (nake.transform.baseVal.length > 0) {
                    currentX = nake.transform.baseVal.getItem(0).matrix.e;
                    currentY = nake.transform.baseVal.getItem(0).matrix.f;
                    lastDx = 0;
                    lastDy = 0;
                }
            }
        );
        return this;
    }
}
