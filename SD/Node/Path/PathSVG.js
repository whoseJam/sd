import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { svg } from "@/Interact/Root";
import { Path } from "@/Node/Path/Path";
import { RenderNode } from "@/Renderer/RenderNode";
import { BasePath } from "./BasePath";
import { BaseSVG } from "./BaseSVG";

let globalPath = undefined;

function pathInterp(node, path) {
    return function (newValue, oldValue) {
        const l = node.delay();
        const r = node.delay() + node.duration();
        new Action(l, r, oldValue, newValue, Interp.pathInterp(path.nake()), node, "d");
    };
}

function createPath() {
    if (globalPath === undefined) {
        globalPath = svg().append("path");
        globalPath.setAttribute("fill-opacity", 0);
        globalPath.setAttribute("stroke-opacity", 0);
    }
}

function pathToBox(d) {
    createPath();
    globalPath.setAttribute("d", d);
    return globalPath.nake().getBBox();
}

function getPointAtLength(d, length) {
    try {
        globalPath.setAttribute("d", d);
        const point = globalPath.nake().getPointAtLength(length);
        return [point.x, point.y];
    } catch (e) {
        return [0, 0];
    }
}

function getPointByRate(d, k) {
    try {
        globalPath.setAttribute("d", d);
        const length = globalPath.nake().getTotalLength() * k;
        const point = globalPath.nake().getPointAtLength(length);
        return [point.x, point.y];
    } catch (e) {
        return [0, 0];
    }
}

function getTotalLength(d) {
    try {
        globalPath.setAttribute("d", d);
        return globalPath.nake().getTotalLength();
    } catch (e) {
        return 0;
    }
}

export class PathSVG extends BasePath {
    constructor(target) {
        super(target);

        BaseSVG.call(this, "path");

        this.type("PathSVG");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            d: "M0,0L0,0",
        });

        this.vars.watch("d", pathInterp(this, this._.nake));

        this._.nake.setAttribute("d", this.vars.d);
    }
}

PathSVG.extend(Path);

Object.assign(PathSVG.prototype, {
    ...Path.prototype,
    ...BaseSVG.prototype,
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), x - this.vars.x, 0, 1, 1];
        this.d(update(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), 0, y - this.vars.y, 1, 1];
        this.d(update(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        if (this.width() === 0) return this;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), 0, 0, width / this.width(), 1];
        this.d(update(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        if (this.height() === 0) return this;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), 0, 0, 1, height / this.height()];
        this.d(update(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    },
    at(k) {
        return getPointByRate(this.d(), k);
    },
    getPointAtLength(length) {
        return getPointAtLength(this.d(), length);
    },
    totalLength() {
        return getTotalLength(this.d());
    },
    d(d) {
        if (arguments.length === 0) return this.vars.d;
        this.vars.d = d;
        const box = pathToBox(d);
        this.vars.x = box.x;
        this.vars.y = box.y;
        this.vars.width = box.width;
        this.vars.height = box.height;
        return this;
    },
});

function update(d, x0, y0, dx, dy, sx, sy) {
    let i = 0;
    function alphabeta(ch) {
        return ("A" <= ch && ch <= "Z") || ("a" <= ch && ch <= "z");
    }
    function valid(ch) {
        return alphabeta(ch) || ("0" <= ch && ch <= "9") || ch === "." || ch === "-";
    }
    function read() {
        let ans = "";
        while (i < d.length && !valid(d[i])) i++;
        while (i < d.length && valid(d[i])) {
            if (ans.length > 0 && alphabeta(ans[0]) !== alphabeta(d[i])) break;
            if (ans.length > 0 && alphabeta(ans[0])) break;
            ans = ans + d[i++];
        }
        if (alphabeta(ans[0])) return ans;
        return +ans;
    }
    function fx(x) {
        return (x - x0) * sx + x0 + dx;
    }
    function fy(y) {
        return (y - y0) * sy + y0 + dy;
    }
    let ans = "";
    while (i < d.length) {
        const operator = read();
        if (i >= d.length) break;
        switch (operator) {
            case "M": {
                const [x, y] = [read(), read()];
                ans += `M ${fx(x)} ${fy(y)} `;
                break;
            }
            case "L": {
                const [x, y] = [read(), read()];
                ans += `L ${fx(x)} ${fy(y)} `;
                break;
            }
            case "H": {
                const x = read();
                ans += `H ${fx(x)} `;
                break;
            }
            case "V": {
                const y = read();
                ans += `V ${fy(y)} `;
                break;
            }
            case "Q": {
                const [x1, y1] = [read(), read()];
                const [x, y] = [read(), read()];
                ans += `Q ${fx(x1)} ${fy(y1)} ${fx(x)} ${fy(y)} `;
                break;
            }
            case "T": {
                const [x, y] = [read(), read()];
                ans += `T ${fx(x)} ${fy(y)} `;
                break;
            }
            case "C": {
                const [x1, y1] = [read(), read()];
                const [x2, y2] = [read(), read()];
                const [x, y] = [read(), read()];
                ans += `C ${fx(x1)} ${fy(y1)} ${fx(x2)} ${fy(y2)} ${fx(x)} ${fy(y)} `;
                break;
            }
            case "S": {
                const [x2, y2] = [read(), read()];
                const [x, y] = [read(), read()];
                ans += `S ${fx(x2)} ${fy(y2)} ${fx(x)} ${fy(y)} `;
                break;
            }
            case "A": {
                const [rx, ry, rotation, f0, f1, x, y] = [read(), read(), read(), read(), read(), read(), read()];
                ans += `A ${rx * sx} ${ry * sy} ${rotation} ${f0} ${f1} ${fx(x)} ${fy(y)} `;
                break;
            }
            case "Z": {
                ans += "Z";
                break;
            }
            default: {
                throw new Error(flag + " Unknown");
            }
        }
    }
    return ans;
}
