import * as sd from "@/sd";

export class XorLinearSet extends sd.SD2DNode {
    constructor(target, dim, data) {
        super(target);
        data = data || [];
        this._.grid = new sd.Grid(this).n(dim).m(dim);
        this._.set = sd.make1d(dim, 0);
        this._.dim = dim;
        for (let i = 0; i < data.length; i++) this.__insert(data[i]);
        for (let i = 0; i < dim; i++) sd.Label(this._.grid.element(i, 0), `$v_${this.__i(i)}$`);
        this.childAs(this._.grid);
    }
    dim() {
        return this._.dim;
    }
    element(i, j) {
        return this._.grid.element(this.__i(i), this.__i(j));
    }
    base(i) {
        return this._.set[i];
    }
    x(x) {
        if (arguments.length === 0) return this._.grid.x();
        this._.grid.x(x);
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this._.grid.y();
        this._.grid.y(y);
        return this;
    }
    width(width) {
        if (arguments.length === 0) return this._.grid.width();
        this._.grid.width(width);
        return this;
    }
    height(height) {
        if (arguments.length === 0) return this._.grid.height();
        this._.grid.height(height);
        return this;
    }
    size() {
        let size = 0;
        for (let i = 0; i < this._.set.length; i++) if (this._.set[i] !== 0) size++;
        return size;
    }
    insert(v) {
        this.__insert(v);
        return this;
    }
    async insertAsync(v) {
        await sd.pause();
        const math = new sd.Math(this, castBinToStr(v, this._.dim))
            .cx(this.cx())
            .my(this.y() - 20)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        await sd.pause();
        this.startAnimate().insert(v).endAnimate();
        math.startAnimate().opacity(0).endAnimate().remove();
    }
    __insert(v) {
        for (let i = this._.dim - 1; i >= 0; i--) {
            if ((v >> i) & 1) {
                if (this._.set[i]) {
                    v ^= this._.set[i];
                } else {
                    this._.set[i] = v;
                    for (let j = 0; j < this._.dim; j++) this._.grid.value(this.__i(i), this.__i(j), (v >> j) & 1);
                    return true;
                }
            }
        }
        return false;
    }
    __i(i) {
        return this._.dim - 1 - i;
    }
}

function castBinToStr(v, n) {
    let ans = "";
    for (let i = n; i >= 1; i--) ans = ans + String((v >> (i - 1)) & 1);
    return ans;
}
