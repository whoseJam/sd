import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/SVG/Text";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

function asideRule(element, index, location, gap) {
    R.aside(location + "c", gap)(element, index);
}

function getStart(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        if (parent.axis() === "row") {
            return location === "t" || location === "b" ? parent.startM() : parent.startN();
        } else {
            return location === "t" || location === "b" ? parent.startN() : parent.startM();
        }
    } else return parent.start();
}

function getLength(parent, location) {
    if (Check.isTypeOfGrid(parent)) {
        if (parent.axis() === "row") {
            return location === "t" || location === "b" ? parent.m() : parent.n();
        } else {
            return location === "t" || location === "b" ? parent.n() : parent.m();
        }
    } else return parent.length();
}

function getGap(gap, parent, location) {
    return gap + (location === "l" || location === "r") * 3;
}

function getElement(parent, location, i) {
    if (Check.isTypeOfGrid(parent)) {
        if (parent.axis() === "row") {
            if (location === "t") {
                for (let rowId = parent.startN(); rowId <= parent.endN(); rowId++) if (parent.endM(rowId) >= i) return parent.element(rowId, i);
                ErrorLauncher.invalidComponentStatus();
            }
            if (location === "b") {
                for (let rowId = parent.endN(); rowId >= parent.startN(); rowId--) if (parent.endM(rowId) >= i) return parent.element(rowId, i);
                ErrorLauncher.invalidComponentStatus();
            }
            if (location === "l") return parent.element(i, parent.startM());
            if (location === "r") return parent.element(i, parent.endM(i));
        } else {
            if (location === "t") return parent.element(i, parent.startM());
            if (location === "b") return parent.element(i, parent.endM(i));
            if (location === "l") {
                for (let rowId = parent.startN(); rowId <= parent.endN(); rowId++) if (parent.endM(rowId) >= i) return parent.element(rowId, i);
                ErrorLauncher.invalidComponentStatus();
            }
            if (location === "r") {
                for (let rowId = parent.endN(); rowId >= parent.startN(); rowId--) if (parent.endM(rowId) >= i) return parent.element(rowId, i);
                ErrorLauncher.invalidComponentStatus();
            }
        }
    } else return parent.element(i);
}

export function Index(parent, location = "t", fontSize = 15, gap = 3) {
    const index = new SDNode(parent);
    index.type("Index");
    index.vars.merge({
        gap: gap,
        location: location,
        fontSize: fontSize,
        elements: [],
    });
    index.gap = Factory.handlerLowPrecise("gap");
    index.location = Factory.handler("location");
    index.fontSize = Factory.handlerLowPrecise("fontSize");
    index.effect("fontSize", () => {
        index.vars.elements.forEach(element => {
            element.fontSize(index.fontSize());
        });
    });
    index.effect("index", () => {
        const map = {};
        const location = index.location();
        const gap = getGap(index.gap(), parent, location);
        const start = getStart(parent, location);
        const length = getLength(parent, location);
        index.vars.elements.forEach(element => (map[element.intValue()] = element));
        for (let i = start; i < start + length; i++) {
            if (!map[i]) {
                const element = new Text(index, i).opacity(0);
                element.onEnter(EN.appear());
                element.onExit(EX.fade());
                index.childAs(element);
                index.vars.elements.push(element);
            } else delete map[i];
        }
        for (let id in map) {
            const element = map[id];
            index.eraseChild(element);
            index.vars.elements.splice(index.vars.elements.indexOf(element), 1);
        }
        index.vars.elements.forEach(element => {
            const i = element.intValue();
            index.tryUpdate(element, () => {
                asideRule(getElement(parent, location, i), element, location, gap);
            });
        });
    });
    parent.childAs(index);
    return index;
}
