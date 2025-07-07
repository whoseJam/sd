import { Context } from "@/Animate/Context";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/Text/Text";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

const pointerMap = {};

function labelRule(parent, child) {
    const gap = 3;
    const direction = parent.direction();
    if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
    if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
    if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
    if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
}

function addPointerMap(pointer, element) {
    if (!pointerMap[element.id]) pointerMap[element.id] = [];
    pointerMap[element.id].push(pointer);
    pointer.vars.element = element;
}

function erasePointerMap(pointer) {
    const element = pointer.vars.element;
    if (!element) return;
    pointerMap[element.id] = pointerMap[element.id].filter(p => p !== pointer);
    if (pointerMap[element.id].length >= 1) pointerMap[element.id][0].triggerEffect("pointer");
}

export function Pointer(parent, label, direction = "b", gap = 3, length = 20) {
    const pointer = new Line(parent).opacity(0).arrow();
    pointer.vars.merge({
        element: undefined,
        length,
        direction,
        gap,
    });
    pointer.direction = Factory.handler("direction");
    pointer.length = Factory.handlerLowPrecise("length");
    pointer.gap = Factory.handlerLowPrecise("gap");
    pointer.moveTo = function (x, y) {
        if (Check.isFalse(x)) {
            erasePointerMap(this);
            pointer.vars.element = undefined;
            this.opacity(0);
            return this;
        }
        if (arguments.length === 2) return this.moveTo(parent.element(x, y));
        else if (arguments.length === 1 && !(x instanceof SDNode)) return this.moveTo(parent.element(x));
        erasePointerMap(this);
        if (this.opacity() === 0 && this.duration() > 0) {
            const context = new Context(this);
            context.till(0, 0);
            addPointerMap(this, x);
            context.till(0, 1);
            this.opacity(1);
        } else {
            addPointerMap(this, x);
            this.opacity(1);
        }
        return this;
    };
    pointer.pointAt = function () {
        return this.vars.element;
    };
    pointer.effect("pointer", () => {
        const element = pointer.vars.element;
        if (!element) return;
        const gap = pointer.gap();
        const direction = pointer.direction();
        const pointers = pointerMap[element.id].filter(p => p.direction() === direction && (p.opacity() !== 0 || p === pointer));
        pointers.sort((a, b) => a.id - b.id);
        const dist = 10;
        const width = element.width();
        const mid = (pointers.length - 1) / 2;
        for (let i = 0; i < pointers.length; i++) {
            const k = (i + 1) / (pointers.length + 1);
            const length = pointers[i].length();
            if (direction === "t") {
                const x = width / pointers.length >= dist ? element.kx(k) : element.cx() + (i - mid) * dist;
                pointers[i].source(x, element.my() + gap + length).target(x, element.my() + gap);
            }
            if (direction === "b") pointers[i].source(element.kx(k), element.y() - gap - length).target(element.kx(k), element.y() - gap);
            if (direction === "r") pointers[i].source(element.x() - gap - length, element.ky(k)).target(element.x() - gap, element.ky(k));
            if (direction === "l") pointers[i].source(element.mx() + gap + length, element.ky(k)).target(element.mx() + gap, element.ky(k));
        }
    });
    pointer.childAs("label", new Text(pointer, label), labelRule);
    if (parent instanceof SDNode) parent.childAs(pointer);
    return pointer;
}
