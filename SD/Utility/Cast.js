import { Text } from "@/Node/Nake/Text";

import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export function SelectValidValue(value1, value2) {
    return value1 === undefined || value1 === null ? value2 : value1;
}

export class Cast {
    static castToSDNode(parent, any, id) {
        if (any === null || any === undefined) {
            if (id !== undefined) {
                return new Text(parent, id).opacity(0);
            }
            return null;
        }
        if (typeof any === "function") {
            return any(parent).opacity(0);
        }
        if (typeof any === "string" || typeof any === "number") {
            return new Text(parent, any).opacity(0);
        }
        return any;
    }

    static castD3ToNake(d3) {
        return d3._groups[0][0];
    }

    static castHexToRGB(hex) {
        hex = hex.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    static castToArray(value) {
        if (typeof value === "number") return [value];
        return value;
    }

    static castToNumber(value) {
        if (+value === NaN) {
            ErrorLauncher.invalidCastError("castToNumber");
        }
        return +value;
    }

    static castToViewBox(object) {
        if (typeof object === "string") {
            const args = object.split(" ");
            return { x: +args[0], y: +args[1], width: +args[2], height: +args[3] };
        } else {
            throw new Error("Not Implemented Yet");
        }
    }
}
