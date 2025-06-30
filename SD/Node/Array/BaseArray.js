import { Exit as EX } from "@/Node/Core/Exit";
import { SD2DNode } from "@/Node/SD2DNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export class BaseArray extends SD2DNode {
    constructor(target) {
        super(target);

        this.newLayer("elements");

        this.vars.merge({
            start: 0,
            elements: [],
        });
    }
}

Object.assign(BaseArray.prototype, {
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    start: Factory.handler("start"),
    end() {
        return this.start() + this.length() - 1;
    },
    length(size) {
        if (size === undefined) {
            const elements = this.vars.elements;
            return elements.length;
        }
        let currentLength = this.length();
        while (currentLength < size) this.push(), currentLength++;
        while (currentLength > size) this.pop(), currentLength--;
        return this;
    },
    resize(size) {
        return this.length(size);
    },
    indexOf(element) {
        for (let i = this.start(); i <= this.end(); i++) if (this.element(i) === element) return i;
        return -1;
    },

    element(i) {
        const id = this.__idx(i);
        if (0 <= id && id < this.length()) return this.vars.elements[id];
        return undefined;
    },
    elements() {
        return [...this.vars.elements];
    },
    firstElement() {
        return this.element(this.start());
    },
    lastElement() {
        return this.element(this.end());
    },
    forEachElement(callback) {
        Check.validateSyncFunction(callback, `${this.type()}.forEachElement`);
        this.vars.elements.forEach((element, id) => callback(element, id + this.start()));
        return this;
    },

    opacity() {
        if (arguments.length === 0) {
            return SD2DNode.prototype.opacity.call(this);
        } else if (arguments.length === 1) {
            if (Check.isOpacity(arguments[0])) {
                const [opacity] = arguments;
                return SD2DNode.prototype.opacity.call(this, opacity);
            } else {
                const [id] = arguments;
                const element = this.__getElementWithMethod(id, "opacity");
                return element.opacity();
            }
        } else {
            const [id, opacity] = arguments;
            const element = this.__getElementWithMethod(id, "opacity");
            element.opacity(opacity);
            return this;
        }
    },
    color() {
        if (arguments.length === 1) {
            if (Check.isColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachElement(element => element.color(color));
            } else {
                const [id] = arguments;
                const element = this.__getElementWithMethod(id, "color");
                return element.color();
            }
        } else if (arguments.length === 2) {
            const [id, color] = arguments;
            const element = this.__getElementWithMethod(id, "color");
            element.color(color);
            return this;
        } else {
            const [l, r, color] = arguments;
            for (let i = l; i <= r; i++) this.color(i, color);
            return this;
        }
    },
    text(id, text) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        if (!element.text) ErrorLauncher.methodNotFound(element, "text");
        if (arguments.length === 1) {
            return element.text();
        } else {
            element.text(text);
            return this;
        }
    },
    intValue(id) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        if (!element.intValue) {
            if (!element.text) ErrorLauncher.methodNotFound(element, "intValue|text");
            const i = Math.floor(+element.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(element.text());
            return i;
        }
        return element.intValue();
    },
    value(i, value) {
        Check.validateNumber(i, `${this.type()}.value`);
        const element = this.__getElementWithMethod(i, "value");
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
    push(value) {
        this.insert(this.end() + 1, value);
        return this;
    },
    pushFromExistValue(value) {
        this.insertFromExistValue(this.end() + 1, value);
        return this;
    },
    pushFromExistElement(value) {
        this.insertFromExistElement(this.end() + 1, value);
        return this;
    },
    pushArray(array) {
        for (let i = 0; i < array.length; i++) this.push(array[i]);
        return this;
    },

    erase(id) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        element.onExitDefault(EX.fade());
        this.__erase(id);
        return this;
    },
    pop() {
        this.erase(this.end());
        return this;
    },
    dropElement(id) {
        const element = this.element(id);
        if (!element) return undefined;
        element.onExit(EX.drop());
        this.__erase(id);
        return element;
    },
    dropFirstElement() {
        return this.dropElement(this.start());
    },
    dropLastElement() {
        return this.dropElement(this.end());
    },
    dropValue(id) {
        const element = this.element(id);
        if (!element) return undefined;
        if (!element.drop) ErrorLauncher.methodNotFound(element, "drop");
        return element.drop();
    },
    dropFirstValue() {
        return this.dropValue(this.start());
    },
    dropLastValue() {
        return this.dropValue(this.end());
    },

    sort(l, r, comparator = (a, b) => a.intValue() - b.intValue()) {
        if (arguments.length === 0) return this.sort(this.start(), this.end(), comparator);
        if (arguments.length === 1) return this.sort(this.start(), this.end(), arguments[0]);
        l -= this.start();
        r -= this.start();
        const elements = this.vars.elements;
        const subarray = elements.slice(l, r + 1);
        subarray.sort(comparator);
        elements.splice(l, subarray.length, ...subarray);
        this.vars.elements = elements;
        return this;
    },

    __idx(i) {
        return i - this.start();
    },
    __insert(id, element) {
        this.childAs(element);
        const idx = this.__idx(id);
        if (idx < 0 || idx > this.length()) ErrorLauncher.outOfRangeError(id);
        this.vars.elements.splice(idx, 0, element);
        return this;
    },
    __erase(id) {
        const element = this.element(id);
        const elements = this.vars.elements;
        elements.splice(this.__idx(id), 1);
        this.eraseChild(element);
        return this;
    },
    __getElementWithMethod(id, method) {
        const element = this.element(id);
        if (!element) ErrorLauncher.arrayElementNotFound(id);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    },
});
