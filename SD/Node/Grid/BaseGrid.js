import { Exit as EX } from "@/Node/Core/Exit";
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
    endM(i) {
        if (arguments.length === 0) return this.startM() + this.m() - 1;
        const _i = this.idxN(i);
        if (_i >= this.vars.elements.length || _i < 0) return this.startM() - 1;
        return this.startM() + this.vars.elements[this.idxN(i)].length - 1;
    },
    idxN(i) {
        return i - this.startN();
    },
    idxM(j) {
        return j - this.startM();
    },
    n(n) {
        if (arguments.length === 0) return this.vars.n;
        while (this.n() < n) this.pushRow();
        while (this.n() > n) this.popRow();
        return this;
    },
    m(m) {
        if (arguments.length === 0) return this.vars.m;
        while (this.m() < m) this.pushCol();
        while (this.m() > m) this.popCol();
        return this;
    },

    element(i, j) {
        const [_i, _j] = [this.idxN(i), this.idxM(j)];
        if (0 <= _i && _i < this.vars.elements.length && 0 <= _j && _j < this.vars.elements[_i].length) return this.vars.elements[_i][_j];
        return undefined;
    },
    forEachElement(callback) {
        this.vars.elements.forEach((row, i) => {
            row.forEach((element, j) => {
                callback(element, i + this.startN(), j + this.startM());
            });
        });
        return this;
    },

    opacity() {
        if (arguments.length === 0) {
            return SD2DNode.prototype.opacity.call(this);
        } else if (arguments.length === 1) {
            const [opacity] = arguments;
            return SD2DNode.prototype.opacity.call(this, opacity);
        } else if (arguments.length === 2) {
            const [i, j] = arguments;
            const element = this.__getElementWithMethod(i, j, "opacity");
            return element.opacity();
        } else {
            const [i, j, opacity] = arguments;
            const element = this.__getElementWithMethod(i, j, "opacity");
            element.opacity(opacity);
            return this;
        }
    },
    color() {
        if (arguments.length === 1) {
            const [color] = arguments;
            return this.forEachElement(element => element.color(color));
        } else if (arguments.length === 2) {
            const [i, j] = arguments;
            const element = this.__getElementWithMethod(i, j);
            return element.color();
        } else {
            const [i, j, color] = arguments;
            const element = this.element(i, j);
            element.color(color);
            return this;
        }
    },
    text(i, j, text) {
        const element = this.element(i, j);
        if (!element) ErrorLauncher.gridElementNotFound(i, j);
        if (!element.text) ErrorLauncher.methodNotFound(element, "text");
        if (arguments.length === 1) {
            return element.text();
        } else {
            element.text(text);
            return this;
        }
    },
    intValue(i, j) {
        const element = this.element(i, j);
        if (!element) return ErrorLauncher.gridElementNotFound(i, j);
        if (!element.intValue) {
            if (!element.text) ErrorLauncher.methodNotFound(element, "intValue|text");
            const i = Math.floor(+element.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(element.text());
            return i;
        }
        return element.intValue();
    },
    value(i, j, value) {
        const element = this.__getElementWithMethod(i, j, "value");
        if (arguments.length === 1) {
            return element.value();
        } else {
            element.value(value);
            return this;
        }
    },

    insert() {
        ErrorLauncher.notImplementedYet("insert", this.type());
    },
    insertFromExistValue() {
        ErrorLauncher.notImplementedYet("insertFromExistValue", this.type());
    },
    insertFromExistElement() {
        ErrorLauncher.notImplementedYet("insertFromExistElement", this.type());
    },
    pushCol(count) {
        const l = this.startN();
        const r = count === undefined ? this.endN() : l + count - 1;
        for (let i = l; i <= r; i++) this.insert(i, this.endM(i) + 1, null);
        if (l > r) this.vars.m++;
        return this;
    },
    pushRow(count) {
        let n = this.endN() + 1;
        let l = this.startM();
        let r = count === undefined ? this.endM() : l + count - 1;
        for (let j = l; j <= r; j++) this.insert(n, j, null);
        if (l > r) {
            this.vars.n++;
            this.vars.elements.push([]);
        }
        return this;
    },

    erase(i, j) {
        const element = this.element(i, j);
        if (!element) ErrorLauncher.gridElementNotFound(i, j);
        element.onExitDefault(EX.fade());
        this.__erase(i, j);
        return this;
    },
    dropElement(i, j) {
        const element = this.element(i, j);
        if (!element) return undefined;
        element.onExit(EX.drop());
        this.__erase(i, j);
        return element;
    },
    dropValue(i, j) {
        const element = this.element(i, j);
        if (!element) return undefined;
        if (!element.drop) ErrorLauncher.methodNotFound(element, "drop");
        return element.drop();
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

    __insert(i, j, element) {
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
    __erase(i, j) {
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
    __getElementWithMethod(i, j, method) {
        const element = this.element(i, j);
        if (!element) ErrorLauncher.gridElementNotFound(i, j);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    },
};
