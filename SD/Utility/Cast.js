import { Text } from "@/Node/Text/Text";

export class Cast {
    static castToSDNode(target, any, id) {
        if (any === null || any === undefined) {
            if (id !== undefined) return new Text(target, id).opacity(0);
            return null;
        }
        if (typeof any === "function") return any(target).opacity(0);
        if (typeof any === "string" || typeof any === "number") return new Text(target, any).opacity(0);
        return any;
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
    static castToViewBox(object) {
        if (typeof object === "string") {
            const args = object.split(" ");
            return { x: +args[0], y: +args[1], width: +args[2], height: +args[3] };
        } else throw new Error("Not Implemented Yet");
    }
    static castPointsToBox(points) {
        let x = Infinity;
        let mx = -Infinity;
        let y = Infinity;
        let my = -Infinity;
        points.forEach(point => {
            x = Math.min(x, point[0]);
            mx = Math.max(mx, point[0]);
            y = Math.min(y, point[1]);
            my = Math.max(my, point[1]);
        });
        if (x === Infinity || y === Infinity) return { x: 0, y: 0, width: 0, height: 0 };
        return { x, y, width: mx - x, height: my - y };
    }
}
