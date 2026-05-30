import * as sd from "@/sd";

export class XorLinearSetPure {
    constructor(dim) {
        this.dim = dim;
        this.set = sd.make1d(dim, 0);
        this.pos = sd.make1d(dim, 0);
    }
    insert(v) {
        for (let i = this.dim - 1; i >= 0; i--) {
            if ((v >> i) & 1) {
                if (this.set[i]) {
                    v ^= this.set[i];
                } else {
                    this.set[i] = v;
                    return true;
                }
            }
        }
        return false;
    }
    insertWithPos(v, p) {
        let debug = false;
        if (p === 2) debug = true;
        for (let i = this.dim - 1; i >= 0; i--) {
            if ((v >> i) & 1) {
                if (this.set[i]) {
                    if (this.pos[i] < p) {
                        [p, this.pos[i]] = [this.pos[i], p];
                        [v, this.set[i]] = [this.set[i], v];
                        v ^= this.set[i];
                    } else {
                        v ^= this.set[i];
                    }
                } else {
                    this.set[i] = v;
                    this.pos[i] = p;
                    return true;
                }
            }
        }
        return false;
    }
    clone() {
        const ans = new XorLinearSetPure(this.dim);
        for (let i = 0; i < this.dim; i++) {
            ans.set[i] = this.set[i];
            ans.pos[i] = this.pos[i];
        }
        return ans;
    }
}
