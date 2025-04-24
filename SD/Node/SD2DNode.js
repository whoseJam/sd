import { Action } from "@/Animate/Action";
import { SDNode } from "@/Node/SDNode";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

function interp(node, attrs) {
    return function (t) {
        const k = this.source + (this.target - this.source) * t;
        attrs.setAttribute("opacity", k);
        if (t === 1 && !node._.clickableCalled) {
            attrs.setAttribute("pointer-events", k === 0 ? "none" : "auto");
        }
    };
}

function opacityInterp(node, attrs) {
    return function (newValue, oldValue) {
        const l = node.delay();
        const r = node.delay() + node.duration();
        new Action(l, r, oldValue, newValue, interp(node, attrs), node, "opacity");
    };
}

export function SD2DNode(target) {
    SDNode.call(this, target);

    this.vars.merge({
        opacity: 1,
    });

    if (Check.isTypeOfHTML(this)) {
        this._.layer = createRenderNode(this, this._.layers.__targetLayer, "div");
    } else {
        this._.layer = createRenderNode(this, this._.layers.__targetLayer, "g");
    }

    this.vars.associate("opacity", opacityInterp(this, this._.layer));
}

SD2DNode.prototype = {
    ...SDNode.prototype,
    opacity: Factory.handlerMediumPrecise("opacity"),
    inRange(point) {
        return this.x() <= point[0] && point[0] <= this.mx() && this.y() <= point[1] && point[1] <= this.my();
    },
    x() {
        ErrorLauncher.notImplementedYet("x", this.type());
    },
    y() {
        ErrorLauncher.notImplementedYet("y", this.type());
    },
    width() {
        ErrorLauncher.notImplementedYet("width", this.type());
    },
    height() {
        ErrorLauncher.notImplementedYet("height", this.type());
    },
    scale(scale) {
        if (this.fixAspect()) {
            this.width(this.width() * scale);
        } else {
            this.freeze();
            this.width(this.width() * scale);
            this.height(this.height() * scale);
            this.unfreeze();
        }
        return this;
    },
    pos(xLocator, yLocator, dx = 0, dy = 0) {
        return [
            // vector 2
            this[xLocator]() + dx,
            this[yLocator]() + dy,
        ];
    },
    center(cx, cy) {
        if (arguments.length === 0) {
            return this.pos("cx", "cy");
        } else if (arguments.length === 1) {
            return this.center(cx[0], cx[1]);
        }
        this.freeze();
        this.cx(cx).cy(cy);
        this.unfreeze();
        return this;
    },
    kx(k) {
        return this.x() + this.width() * k;
    },
    ky(k) {
        return this.y() + this.height() * k;
    },
    dx(dx) {
        return this.x(this.x() + dx);
    },
    dy(dy) {
        return this.y(this.y() + dy);
    },
    cx(cx) {
        if (cx === undefined) return this.kx(0.5);
        return this.x(cx - this.width() * 0.5);
    },
    cy(cy) {
        if (cy === undefined) return this.ky(0.5);
        return this.y(cy - this.height() * 0.5);
    },
    mx(mx) {
        if (mx === undefined) return this.kx(1);
        return this.x(mx - this.width());
    },
    my(my) {
        if (my === undefined) return this.ky(1);
        return this.y(my - this.height());
    },
};
