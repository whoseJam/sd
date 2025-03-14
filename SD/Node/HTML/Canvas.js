import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { Camera } from "@/Node/Three/Camera";
import { Renderer } from "@/Node/Three/Renderer";
import { Scene } from "@/Node/Three/Scene";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Factory } from "@/Utility/Factory";

export function Canvas(parent) {
    BaseHTML.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        width: 400,
        height: 300,
    });

    this._.layer.setAttribute("width", "400px");
    this._.layer.setAttribute("height", "300px");
    this._.nake = createRenderNode(this, this._.layer, "canvas");
    this._.nake.setAttribute("width", "100%");
    this._.nake.setAttribute("height", "100%");

    this.vars.associate("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
    this.vars.associate("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    this.vars.associate("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
    this.vars.associate("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
}

Canvas.prototype = {
    ...BaseHTML.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    canvas() {
        return this._.nake;
    },
    three() {
        if (!this._.three) {
            this._.three = true;
            this._.scene = new Scene(this);
            this._.camera = new Camera(this);
            this._.renderer = new Renderer(this);
            this._.renderer.start(this._.scene, this._.camera);
        }
        return this;
    },
    camera() {
        return this._.camera;
    },
};
