import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode } from "@/Node/SDNode";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseArray(parent) {
    SDNode.call(this, parent);

    this.newLayer("elements");

    this.vars.merge({
        start: 0,
        elements: [],
    });

    this._.BASE_ARRAY = true;
}

BaseArray.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    start: Factory.handler("start"),
    length(size) {
        if (size === undefined) {
            const elements = this.vars.elements;
            return elements.length;
        }
        size = Cast.castToNumber(size);
        let currentLength = this.length();
        while (currentLength < size) {
            this.push();
            currentLength++;
        }
        while (currentLength > size) {
            this.pop();
            currentLength--;
        }
        return this;
    },
    resize(size) {
        this.length(size);
        return this;
    },
    end() {
        return this.start() + this.length() - 1;
    },
    idx(i) {
        return i - this.start();
    },
    indexOf(element) {
        for (let i = this.start(); i <= this.end(); i++) if (this.element(i) === element) return i;
        ErrorLauncher.whatHappened();
    },
    element(i) {
        const elements = this.vars.elements;
        const id = this.idx(i);
        if (0 <= id && id < elements.length) return elements[id];
        ErrorLauncher.outOfRangeError(i);
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
        this.vars.elements.forEach((element, i) => callback(element, i + this.start()));
        return this;
    },
    insertByBaseArray(id, element) {
        this.childAs(element);
        const idx = this.idx(id);
        if (idx < 0 || idx > this.length()) ErrorLauncher.outOfRangeError(id);
        this.vars.elements.splice(idx, 0, element);
        return this;
    },
    push(value) {
        this.insert(this.end() + 1, value);
        return this;
    },
    pushArray(array) {
        for (let i = 0; i < array.length; i++) this.push(array[i]);
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
    eraseByBaseArray(id) {
        const element = this.element(id);
        const elements = this.vars.elements;
        elements.splice(this.idx(id), 1);
        this.eraseChild(element);
        return this;
    },
    pop() {
        this.erase(this.end());
        return this;
    },
    erase(id) {
        const element = this.element(id);
        element.onExit(EX.fade());
        this.eraseByBaseArray(id);
        return this;
    },
    dropElement(id) {
        const element = this.element(id);
        this.eraseByBaseArray(id);
        return element;
    },
    dropFirstElement() {
        return this.dropElement(this.start());
    },
    dropLastElement() {
        return this.dropElement(this.end());
    },
    dropValue(id) {
        return this.element(id).drop();
    },
    text(id, text) {
        if (text === undefined) return this.value(id).text();
        this.value(id).text(text);
        return this;
    },
    intValue(id) {
        const value = this.value(id);
        if (value === undefined) return 0;
        return +this.value(id).text();
    },
    opacity() {
        const args = arguments;
        switch (args.length) {
            case 0:
                return SDNode.prototype.opacity.call(this);
            case 1:
                if (Check.isTypeOfOpacity(args[0])) return SDNode.prototype.opacity.call(this, args[0]);
                else return this.element(args[0]).opacity();
            case 2:
                this.element(args[0]).opacity(args[1]);
                return this;
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    value() {
        const args = arguments;
        switch (args.length) {
            case 1:
                return this.element(args[0]).value();
            case 2:
                this.element(args[0]).value(args[1]);
                return this;
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    color() {
        const args = arguments;
        switch (args.length) {
            case 1:
                if (typeof args[0] === "number") return this.element(args[0]).color();
                this.forEachElement(element => element.color(args[0]));
                return this;
            case 2:
                this.element(args[0]).color(args[1]);
                return this;
            case 3:
                for (let i = args[0]; i <= args[1]; i++) this.color(i, args[2]);
                return this;
            default:
                ErrorLauncher.invalidArguments();
        }
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
};
