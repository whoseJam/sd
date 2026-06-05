import * as sd from "@/sd";

export class Graph extends sd.SD2DNode {
    constructor(target, n) {
        super(target);
        this.vars.merge({
            x: 0,
            y: 0,
            width: 400,
            height: 100,
        });
        const links = [];
        const array = new sd.ValueArray(this).start(1);
        const vertex = new sd.Circle(this);
        for (let i = 1; i <= n; i++) array.push(new sd.Circle(array));
        for (let i = 2; i <= array.length(); i++) links.push(sd.Link(array.element(i - 1), array.element(i)).arrow());
        sd.Label(array.firstElement(), "$S$", "tc");
        sd.Label(array.lastElement(), "$T$", "tc");
        this.effect("array", () => {
            array.x(this.x()).y(this.y());
            array.width(this.width());
        });
        this.effect("vertex", () => {
            vertex.cx(this.cx()).my(this.my());
        });
        this._.vertex = vertex;
        this._.S = array.firstElement();
        this._.T = array.lastElement();
        this._.array = array;
        this._.links = links;
    }
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.x = x;
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.y = y;
        return this;
    }
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        this.vars.width = width;
        return this;
    }
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        this.vars.height = height;
        return this;
    }
    vertex() {
        return this._.vertex;
    }
    S() {
        return this._.S;
    }
    T() {
        return this._.T;
    }
    element(i) {
        if (arguments.length === 1) return this._.array.element(i);
        return this._.links[i - 1];
    }
}
