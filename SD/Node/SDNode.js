import { Animate } from "@/Node/Core/Animate";
import { Children } from "@/Node/Core/Children";
import { Enter as EN } from "@/Node/Core/Enter";
import { Interact } from "@/Node/Core/Interact";
import { effect, reactive, uneffect } from "@/Node/Core/Reactive";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Check } from "@/Utility/Check";

let id = 0;

export function SDNode(target) {
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
        freezing: 0,
    };

    if (Check.isTypeOfSDNode(target)) target = target.layer();
    this._.layers.__targetLayer = target;

    this.vars = reactive({});
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
    BASE_SDNODE: true,

    type(type) {
        if (type === undefined) return this._.layer.getAttribute("type");
        this._.layer.setAttribute("type", type);
        return this;
    },
    fixAspect() {
        return false;
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
    remove() {
        this._.layer.remove();
    },

    startAnimate: forward("animate", "startAnimate"),
    endAnimate: forward("animate", "endAnimate"),
    isAnimating: forwardWithReturn("animate", "isAnimating"),
    delay: forwardWithReturn("animate", "delay"),
    after: forward("animate", "after"),
    duration: forwardWithReturn("animate", "duration"),

    freeze() {
        this._.freezing++;
        for (const key in this._.updaters) this._.updaters[key].freeze();
        return this;
    },
    unfreeze() {
        this._.freezing--;
        for (const key in this._.updaters) this._.updaters[key].unfreeze();
        return this;
    },
    freezing() {
        return this._.freezing > 0;
    },
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
    effect(name, callback) {
        if (arguments.length === 1) return this._.updaters[name];
        this._.updaters[name] = effect(callback);
        return this;
    },
    uneffect(name) {
        uneffect(this._.updaters[name]);
        delete this._.updaters[name];
        return this;
    },
    uneffectAll() {
        for (const name in this._.updaters) this.uneffect(name);
        return this;
    },
    triggerEffect(name) {
        this._.updaters[name].trigger();
        return this;
    },

    drag: forward("interact", "drag"),
    clickable: function (type) {
        this._.layer.setAttribute("pointer-events", Check.isFalseType(type) ? "none" : "auto");
        this._.clickableCalled = true;
        return this;
    },
    onClick: forward("interact", "onClick"),
    onDblClick: forward("interact", "onDblClick"),

    onEnter(enter) {
        if (arguments.length === 0) return this._.enter;
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
        if (arguments.length === 0) return this._.exit;
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
    tryUpdate(element, update) {
        if (element.onEnter()) {
            element.triggerEnter(this, update);
        } else update();
    },
};
