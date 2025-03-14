import { Action } from "@/Animate/Action";
import { svg } from "@/Interact/Root";
import { BaseLine } from "@/Node/Nake/BaseLine";

let globalPath = undefined;

function interp(l, r, snap) {
    return function (t) {
        if (t !== 0) return;
        if (l === r) snap.attr({ d: this.target });
        else snap.animate({ d: this.target }, r - l, mina.easeinout);
    };
}

function pathInterp(node, attrs) {
    return function (newValue, oldValue) {
        const l = node.delay();
        const r = node.delay() + node.duration();
        const snap = Snap(attrs.nake());
        new Action(l, r, oldValue, newValue, interp(l, r, snap), node, "d");
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

export function Path(parent) {
    BaseLine.call(this, parent, "path");

    this.type("Path");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        d: "M0,0L0,0",
    });

    this.vars.associate("d", pathInterp(this, this._.nake));

    this._.nake.setAttribute("d", this.vars.d);
}

Path.prototype = {
    ...BaseLine.prototype,
    at(k) {
        return getPointByRate(this.d(), k);
    },
    getPointAtLength(length) {
        return getPointAtLength(this.d(), length);
    },
    totalLength() {
        return getTotalLength(this.d());
    },
    x(x) {
        if (x === undefined) return this.vars.x;
        this.d(move(this.vars.d, x - this.vars.x, 0));
        return this;
    },
    y(y) {
        if (y === undefined) return this.vars.y;
        this.d(move(this.vars.d, 0, y - this.vars.y));
        return this;
    },
    d(d) {
        if (d === undefined) return this.vars.d;
        this.vars.d = d;
        const box = pathToBox(d);
        this.vars.x = box.x;
        this.vars.y = box.y;
        this.vars.width = box.width;
        this.vars.height = box.height;
        return this;
    },
    width() {
        return this.vars.width;
    },
    height() {
        return this.vars.height;
    },
};

function move(d, dx, dy) {
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
    let ans = "",
        x1,
        y1,
        x2,
        y2,
        x,
        y,
        rx,
        ry,
        D,
        f0,
        f1;
    while (i < d.length) {
        let flag = read();
        if (i >= d.length) break;
        switch (flag) {
            case "M":
                x = read();
                y = read();
                ans = ans + "M " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "L":
                x = read();
                y = read();
                ans = ans + "L " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "H":
                x = read();
                ans = ans + "H " + (x + dx) + " ";
                break;
            case "V":
                y = read();
                ans = ans + "V " + (y + dy) + " ";
                break;
            case "Q":
                x1 = read();
                y1 = read();
                x = read();
                y = read();
                ans = ans + "Q " + (x1 + dx) + " " + (y1 + dy) + " " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "T":
                x = read();
                y = read();
                ans = ans + "T " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "C":
                x1 = read();
                y1 = read();
                x2 = read();
                y2 = read();
                x = read();
                y = read();
                ans = ans + "C " + (x1 + dx) + " " + (y1 + dy) + " " + (x2 + dx) + " " + (y2 + dy) + " " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "S":
                x2 = read();
                y2 = read();
                x = read();
                y = read();
                ans = ans + "S " + (x2 + dx) + " " + (y2 + dy) + " " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "A":
                rx = read();
                ry = read();
                D = read();
                f0 = read();
                f1 = read();
                x = read();
                y = read();
                ans = ans + "A " + rx + " " + ry + " " + D + " " + f0 + " " + f1 + " " + (x + dx) + " " + (y + dy) + " ";
                break;
            case "Z":
                ans = ans + "Z ";
                break;
            default:
                throw new Error(flag + " Unknown");
        }
    }
    return ans;
}
