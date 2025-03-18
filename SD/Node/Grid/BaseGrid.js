import { SD2DNode } from "@/Node/SD2DNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseGrid(parent) {
    SD2DNode.call(this, parent);

    this.vars.merge({
        n: 0,
        m: 0,
        x: 0,
        y: 0,
        startN: 0,
        startM: 0,
        elements: [],
    });
}

BaseGrid.prototype = {
    ...SD2DNode.prototype,
    BASE_GRID: true,
    startN: Factory.handler("startN"),
    startM: Factory.handler("startM"),
    endN() {
        return this.startN() + this.n() - 1;
    },
    endM(idx) {
        if (idx === undefined) return this.startM() + this.m() - 1;
        const elements = this.vars.elements;
        return this.startM() + elements[this.idxN(idx)].length - 1;
    },
    idxN(idx) {
        return idx - this.startN();
    },
    idxM(idx) {
        return idx - this.startM();
    },
    n(n) {
        if (n === undefined) return this.vars.n;
        while (this.n() < n) this.pushRow();
        while (this.n() > n) this.popRow();
        return this;
    },
    m(m) {
        if (m === undefined) return this.vars.m;
        while (this.m() < m) this.pushCol();
        while (this.m() > m) this.popCol();
        return this;
    },
    insertByBaseGrid(i, j, element) {
        const ri = this.idxN(i);
        const rj = this.idxM(j);
        if (ri < 0) ErrorLauncher.outOfRangeError(i, j);
        this.childAs(element);
        const elements = this.vars.elements;
        while (elements.length <= ri) elements.push([]);
        if (rj < 0 || rj > elements[ri].length) ErrorLauncher.outOfRangeError(i, j);
        elements[ri].splice(rj, 0, element);
        this.vars.n = elements.length;
        this.vars.m = Math.max(elements[ri].length, this.vars.m);
        return this;
    },
    eraseByBaseGrid(i, j) {
        const element = this.element(i, j);
        const ri = this.idxN(i);
        const rj = this.idxM(j);
        const elements = this.vars.elements;
        elements[ri].splice(rj, 1);
        this.eraseChild(element);
        let m = 0;
        for (let i = 0; i < elements.length; i++) m = Math.max(m, elements[i].length);
        this.vars.n = elements.length;
        this.vars.m = m;
        return this;
    },
    popCol() {
        let erased = false;
        const elements = this.vars.elements;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i].pop();
            if (element) {
                this.eraseChild(element);
                erased = true;
            }
        }
        if (erased) this.vars.m--;
        return this;
    },
    popRow() {
        const row = this.vars.elements.pop();
        if (!row) return this;
        row.forEach(element => this.eraseChild(element));
        this.vars.n--;
        return this;
    },
    pushCol(rows) {
        const l = this.startN();
        const r = rows === undefined ? this.endN() : l + rows - 1;
        for (let i = l; i <= r; i++) this.insert(i, this.endM(i) + 1, null);
        if (l > r) this.vars.m++;
        return this;
    },
    pushRow(cols) {
        let n = this.endN() + 1;
        let l = this.startM();
        let r = cols === undefined ? this.endM() : l + cols - 1;
        for (let j = l; j <= r; j++) this.insert(n, j, null);
        if (l > r) {
            this.vars.n++;
            this.vars.elements.push([]);
        }
        return this;
    },
    element(i, j) {
        [i, j] = [this.idxN(i), this.idxM(j)];
        if (0 <= i && i < this.vars.elements.length) {
            if (0 <= j && j < this.vars.elements[i].length) {
                return this.vars.elements[i][j];
            }
            ErrorLauncher.outOfRangeError(i + this.startN(), j + this.startM());
        }
        ErrorLauncher.outOfRangeError(i + this.startN(), j + this.startM());
    },
    forEachElement(callback) {
        this.vars.elements.forEach((row, i) => {
            row.forEach((element, j) => {
                callback(element, i + this.startN(), j + this.startM());
            });
        });
        return this;
    },
    value() {
        const args = arguments;
        switch (args.length) {
            case 2: {
                const element = this.element(args[0], args[1]);
                return element.value();
            }
            case 3: {
                const element = this.element(args[0], args[1]);
                element.value(args[2]);
                return this;
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    intValue(i, j) {
        const value = this.value(i, j);
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        return +value.text();
    },
    opacity() {
        const args = arguments;
        switch (args.length) {
            case 0:
                return SD2DNode.prototype.opacity.call(this);
            case 1:
                return SD2DNode.prototype.opacity.call(this, args[1]);
            case 2: {
                const element = this.element(args[0], args[1]);
                return element.opacity();
            }
            case 3: {
                const element = this.element(args[0], args[1]);
                element.opacity(args[2]);
                return this;
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    color() {
        const args = arguments;
        switch (args.length) {
            case 1:
                this.forEachElement(element => element.color(args[0]));
                return this;
            case 2: {
                const element = this.element(args[0], args[1]);
                return element.color();
            }
            case 3: {
                const element = this.element(args[0], args[1]);
                element.color(args[2]);
                return this;
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
};
