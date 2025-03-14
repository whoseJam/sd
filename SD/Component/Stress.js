import { Context } from "@/Animate/Context";

export function Stress(parent) {
    parent.stress = function (rate = 1.2) {
        const cx = this.cx();
        const cy = this.cy();
        const width = this.width();
        const context = new Context(this);

        context.till(0, 0.5);
        this.width(width * rate);
        this.cx(cx).cy(cy);

        context.till(0.5, 1);
        this.width(width);
        this.cx(cx).cy(cy);
        context.recover();
        return this;
    };
    return parent;
}
