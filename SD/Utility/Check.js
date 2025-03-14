function isTypeOf(type) {
    const str = `BASE_${type}`;
    return function (node) {
        if (node && node._) return node._[str];
        return false;
    };
}

export class Check {
    static isTypeOfSDNode = isTypeOf("SDNODE");
    static isTypeOfArray = isTypeOf("ARRAY");
    static isTypeOfElement = isTypeOf("ELEMENT");
    static isTypeOfCurve = isTypeOf("CURVE");
    static isTypeOfGraph = isTypeOf("GRAPH");
    static isTypeOfGrid = isTypeOf("GRID");
    static isTypeOfHTML = isTypeOf("HTML");
    static isTypeOfNake = isTypeOf("NAKE");
    static isTypeOfTree = isTypeOf("TREE");
    static isTypeOfLine = isTypeOf("LINE");
    static isFalseType(object) {
        return object === null || object === undefined || object === false;
    }
    static isNumberOrString(object) {
        return typeof object === "number" || typeof object === "string";
    }
    static isTypeOfString(object) {
        return typeof object === "string";
    }
    static isTypeOfOpacity(object) {
        if (typeof object !== "number") return false;
        return 0 <= object && object <= 1;
    }
    static isTypeOfColor(object) {
        if (typeof object === "string" && object.startsWith("#")) return true;
        else if (typeof object === "object" && object.main && object.border) return true;
        return false;
    }
    static isValidNumber(object) {
        return typeof object === "number" && object !== NaN && object !== Infinity && object !== -Infinity;
    }
    static isTypeOfVector(object) {
        return object && typeof object[0] === "number" && typeof object[1] === "number";
    }
    static isTypeOfThreeNode(object) {
        return object && object.IS_THREE_NODE;
    }
}
