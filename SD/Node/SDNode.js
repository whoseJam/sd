import { Action } from "@/Animate/Action";
import { Animate } from "@/Node/Core/Animate";
import { Children } from "@/Node/Core/Children";
import { Interact } from "@/Node/Core/Interact";
import { Location } from "@/Node/Core/Location";
import { effect, reactive, uneffect } from "@/Node/Core/Reactive";
import { createRenderNode } from "@/Renderer/RenderNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";
import { Enter as EN } from "@/Node/Core/Enter";

let id = 0;

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

export function SDNode(parent, layer = undefined, group = undefined) {
    this.id = ++id;
    this._ = {
        ready: false, // only when ready = true, the action can impact the node
        layer: undefined,
        layers: {},
        parent: undefined,
        animate: new Animate(this),
        children: new Children(this),
        interact: new Interact(this),
        updaters: {},
    };
    group = group === undefined ? "g" : group;

    if (Check.isTypeOfSDNode(parent)) {
        // parent is SDNode
        this._.parent = parent;
        if (!layer) {
            this._.layer = createRenderNode(this, parent.layer(), group);
        } else {
            // appear later, layer is undefined
            this._.layer = createRenderNode(this, undefined, layer);
        }
    } else {
        // parent is RenderNode
        if (Check.isTypeOfThreeNode(parent)) {
            this._.parent = parent.parent;
            this._.layer = parent;
        } else {
            this._.parent = parent.parent;
            if (!layer) {
                this._.layer = createRenderNode(this, parent, group);
            } else {
                // appear later, layer is undefined
                this._.layer = createRenderNode(this, undefined, layer);
            }
        }
    }

    this.vars = reactive({
        opacity: 1,
    });

    this.vars.associate("opacity", opacityInterp(this, this._.layer));

    this._.BASE_SDNODE = true;
}

function forward(comp, func) {
    return function () {
        const component = this._[comp];
        component[func].apply(component, arguments);
        return this;
    };
}

function forwardWithReturn(comp, func) {
    return function () {
        const component = this._[comp];
        return component[func].apply(component, arguments);
    };
}

SDNode.prototype = {
    ...SDNode.prototype,
    type(type) {
        if (type === undefined) return this._.layer.getAttribute("type");
        this._.layer.setAttribute("type", type);
        return this;
    },
    layer(name) {
        return name === undefined ? this._.layer : this._.layers[name];
    },
    newLayer(name) {
        const layer = new SVGNode(this, this._.layer, "g");
        this._.layers[name] = layer;
        layer.setAttribute("layer", name);
        return this;
    },
    attachTo(parent) {
        if (Check.isTypeOfSDNode(parent)) {
            // parent is SDNode
            this._.layer.moveTo(parent.layer());
        } else {
            // parent is RenderNode
            this._.layer.moveTo(parent);
        }
        return this;
    },
    childAs() {
        const args = [...arguments];
        const child = args.filter(arg => Check.isTypeOfSDNode(arg))[0];
        const rule = args.filter(arg => typeof arg === "function")[0];
        const update = () => {
            if (child._.parent !== this && !child.onEnter()) child.attachTo(this);
            this._.children.push(args[0], args[1], args[2]);
        };
        if (!child.onEnter()) child.onEnter(EN.appear());
        if (rule) this.tryUpdate(child, update);
        else update();
        return this;
    },
    child: forwardWithReturn("children", "child"),
    hasChild: forwardWithReturn("children", "has"),
    eraseChild: forwardWithReturn("children", "erase"),
    startAnimate: forward("animate", "startAnimate"),
    endAnimate: forward("animate", "endAnimate"),
    isAnimating: forwardWithReturn("animate", "isAnimating"),
    delay: forwardWithReturn("animate", "delay"),
    after: forward("animate", "after"),
    duration: forwardWithReturn("animate", "duration"),
    opacity: Factory.handlerMediumPrecise("opacity"),
    inRange(vec) {
        return this.x() <= vec[0] && vec[0] <= this.mx() && this.y() <= vec[1] && vec[1] <= this.my();
    },
    remove() {
        this._.layer.remove();
    },
    scale: Location.scale,
    pos: Location.position,
    center: Location.center,
    kx: Location.kQuantileLocation("x", "width"),
    ky: Location.kQuantileLocation("y", "height"),
    cx: Location.centerLocation("x", "width"),
    cy: Location.centerLocation("y", "height"),
    mx: Location.maxiumLocation("x", "width"),
    my: Location.maxiumLocation("y", "height"),
    dx: Location.moveLocation("x"),
    dy: Location.moveLocation("y"),
    drag: forward("interact", "drag"),
    clickable: function (type) {
        this._.layer.setAttribute("pointer-events", Check.isFalseType(type) ? "none" : "auto");
        this._.clickableCalled = true;
        return this;
    },
    onClick: forward("interact", "onClick"),
    onDblClick: forward("interact", "onDblClick"),
    rule(rule) {
        if (rule === undefined) return this._.rule;
        this._.rule = effect(() => {
            rule(this._.parent, this);
        }, this.type() + "-rule");
        return this;
    },
    eraseRule() {
        if (!this.rule()) return this;
        uneffect(this._.rule);
        this._.rule = undefined;
        return this;
    },
    onEnter(enter) {
        if (enter === undefined) return this._.enter;
        this._.enter = enter;
        return this;
    },
    onEnterDefault(enter) {
        if (!this._.enter) this._.enter = enter;
        return this;
    },
    triggerEnter(parent, move) {
        if (!this._.enter) return this;
        this._.entering = true;
        this._.enter.call(parent, this, move);
        this._.entering = this._.enter = undefined;
        return this;
    },
    entering() {
        return this._.entering !== undefined;
    },
    onExit(exit) {
        if (exit === undefined) return this._.exit;
        this._.exit = exit;
        return this;
    },
    onExitDefault(exit) {
        if (!this._.exit) this._.exit = exit;
        return this;
    },
    triggerExit() {
        if (!this._.exit) return this;
        this._.exit.call(this._.parent, this);
        this._.exit = undefined;
        return this;
    },
    title(title) {
        const titleElment = new SVGNode(this, this._.layer, "title");
        titleElment.setAttribute("innerHTML", title);
        return this;
    },
    freeze() {
        for (const key in this._.updaters) this._.updaters[key].freeze();
        return this;
    },
    unfreeze() {
        for (const key in this._.updaters) this._.updaters[key].unfreeze();
        return this;
    },
    effect(name, callback) {
        if (arguments.length === 1) return this._.updaters[name];
        this._.updaters[name] = effect(callback);
    },
    uneffect(name) {
        uneffect(this._.updaters[name]);
    },
    tryUpdate(element, update) {
        if (element.onEnter()) {
            element.triggerEnter(this, update);
        } else update();
    },
};
