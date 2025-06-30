import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class Check {
    static isFalse(object) {
        return object === null || object === undefined || object === false;
    }
    static isEmpty(object) {
        return object === null || object === undefined;
    }
    static isString(object) {
        return typeof object === "string";
    }
    static isOpacity(object) {
        if (typeof object !== "number") return false;
        return 0 <= object && object <= 1;
    }
    static isColor(object) {
        if (typeof object === "string" && object.startsWith("#")) return true;
        else if (typeof object === "object" && object.main && object.border) return true;
        return false;
    }
    static isNumber(object) {
        return typeof object === "number" && !isNaN(object) && object !== Infinity && object !== -Infinity;
    }
    static isNumberOrString(object) {
        return typeof object === "number" || typeof object === "string";
    }
    static isVector(object) {
        return object && typeof object[0] === "number" && typeof object[1] === "number";
    }
    static isColor(object) {
        return this.isHexColor(object) || this.isSDColor(object);
    }
    static isSDColor(object) {
        if (!object) return false;
        if (typeof object !== "object") return false;
        return this.isHexColor(object.fill) && this.isHexColor(object.stroke);
    }
    static isHexColor(object) {
        if (!object) return false;
        if (typeof object !== "string") return false;
        if (object.length !== 7) return false;
        if (object[0] !== "#") return false;
        for (let i = 1; i <= 6; i++) if ("0123456789aAbBcCdDeEfF".indexOf(object[i]) === -1) return false;
        return true;
    }
    static isAsyncFunction(object) {
        if (typeof object !== "function") return false;
        const str = object.toString();
        return str.startsWith("async");
    }
    static isSyncFunction(object) {
        if (typeof object !== "function") return false;
        return !this.isAsyncFunction(object);
    }

    static validateOpacity(object, method, i = 1, suggestions = []) {
        if (!this.isOpacity(object)) ErrorLauncher.invalidOpacity(object, method, i, suggestions);
    }
    static validateNumber(object, method, i = 1, suggestions = []) {
        if (!this.isNumber(object)) ErrorLauncher.invalidNumber(object, method, i, suggestions);
    }
    static validateNumberOrString(object, method, i = 1, suggestions = []) {
        if (!this.isNumberOrString(object)) ErrorLauncher.invalidNumberOrString(object, method, i, suggestions);
    }
    static validateColor(object, method, i = 1, suggestions = []) {
        if (!this.isColor(object)) ErrorLauncher.invalidColorFormat(object, method, i, suggestions);
    }
    static validateSyncFunction(object, method, i = 1, suggestions = []) {
        if (!this.isSyncFunction(object)) ErrorLauncher.invalidSyncFunction(object, method, i, suggestions);
    }
    static validateArgumentsCountEqualTo(args, count, method) {
        if (args.length !== count) throw new Error(`The ${method} expect ${count} arguments, but got ${args.length} arguments.`);
    }
}
