import { SDNode } from "@/Node/SDNode";

export class ErrorLauncher {
    static unknownKeyError(key) {
        throw new Error(`Unknown key ${key}.`);
    }
    static invalidCastError(key) {
        throw new Error(`Invalid cast ${key}.`);
    }
    static invalidInvoke(method) {
        throw new Error(`Function ${method} cannot be invoked in current environment.`);
    }
    static outOfRangeError(i, j) {
        if (arguments.length === 1) throw new Error(`Index ${i} out of range.`);
        else throw new Error(`Index (${i}, ${j}) out of range.`);
    }
    static invalidArguments() {
        throw new Error("Invalid arguments");
    }
    static invalidComponentStatus() {
        throw new Error("The component somehow get into an invalid status.");
    }
    static nodeNotFound(node) {
        if (node instanceof SDNode) {
            console.log(node);
            throw new Error("Tree/Graph node above not found.");
        } else {
            throw new Error(`Tree/Graph node[${node}] not found.`);
        }
    }
    static linkNotFound(source, target) {
        let sourceLabel;
        let targetLabel;
        if (source instanceof SDNode) {
            console.log("source =", source);
            sourceLabel = "source";
        } else sourceLabel = source;
        if (target instanceof SDNode) {
            console.log("target =", target);
            targetLabel = "target";
        }
        throw new Error(`Tree/Graph link[${source},${target}] not found.`);
    }
    static lcaNotFound() {
        throw new Error("LCA NOT FOUND.");
    }
    static whatHappened() {
        throw new Error("What happened???");
    }
    static notImplementedYet(method, clazz) {
        if (arguments.length === 2) {
            throw new Error(`Function ${clazz}.${method} not implemented yet.`);
        } else {
            throw new Error(`Function ${method} not implemented yet.`);
        }
    }
    static failToParseAsIntValue(text) {
        throw new Error(`Fail to parse ${text} as int value.`);
    }
    static methodNotFound(node, method) {
        if (typeof node.type === "function") node = node.type();
        throw new Error(`Cannot invoke method ${method} on ${node}.`);
    }
    static arrayElementNotFound(id) {
        throw new Error(`Array element[${id}] not found.`);
    }
    static gridElementNotFound(rowId, colId) {
        throw new Error(`Grid element[${rowId}, ${colId}] not found.`);
    }
    static invalidOpacity(opacity, method, i = 1, suggestions = []) {
        throw new Error(`We expect an opacity for the ${generateLocation(i)} argument when calling ${method} but got <${opacity}>[type is ${typeof opacity}]. ${generateSuggestion(opacity, suggestions)}`);
    }
    static invalidNumber(number, method, i = 1, suggestions = []) {
        throw new Error(`We expect a number for the ${generateLocation(i)} argument when calling ${method} but got <${number}>[type is ${typeof number}]. ${generateSuggestion(number, suggestions)}`);
    }
    static invalidNumberOrString(object, method, i = 1, suggestions = []) {
        throw new Error(`We expect a number or a string for the ${generateLocation(i)} argument when calling ${method} but got <${object}>[type is ${typeof object}]. ${generateSuggestion(object, suggestions)}`);
    }
    static invalidColor(color, method, i = 1, suggestions = []) {
        throw new Error(`We expect a hex-color or a { fill: hex-color, stroke: hex-color } for the ${generateLocation(i)} argument when calling ${method} but got <${color}>[type is ${typeof color}]. ${generateSuggestion(color, suggestions)}`);
    }
    static invalidSDColor(color, method, i = 1, suggestions = []) {
        throw new Error(`We expect a { fill: hex-color, stroke: hex-color } for the ${generateLocation(i)} argument when calling ${method} but got <${color}>[type is ${typeof color}]. ${generateSuggestion(color, suggestions)}`);
    }
    static invalidHexColor(color, method, i = 1, suggestions = []) {
        throw new Error(`We expect a hex-color for the ${generateLocation(i)} argument when calling ${method} but got <${color}>[type is ${typeof color}]. ${generateSuggestion(color, suggestions)}`);
    }
    static invalidSyncFunction(callback, method, i = 1, suggestions = []) {
        throw new Error(`We expect a synchronized function for the ${generateLocation(i)} argument when calling the ${method} but got <${callback}>[type is ${typeof callback}]. ${generateSuggestion(callback, suggestions)}`);
    }
    static warnNotImplementedYet(method) {
        console.warn(`Function ${method} not implemented yet.`);
    }
}

function generateSuggestion(object, suggestions) {
    for (const suggestion of suggestions) {
        const [check, result] = suggestion;
        if (check(object)) return result;
    }
    return "";
}

function generateLocation(i) {
    if (i === 1) return "1st";
    if (i === 2) return "2nd";
    if (i === 3) return "3rd";
    return `${i}th`;
}
