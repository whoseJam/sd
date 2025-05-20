import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { Scene } from "@/Node/Three/Scene";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { WebGLRenderer } from "three";
import { OrthographicCamera } from "../Three/Camera/OrthgraphicCamera";
import { PerspectiveCamera } from "../Three/Camera/PerspectiveCamera";

export function Canvas(target) {
    BaseHTML.call(this, target);

    this.type("Canvas");

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
            this._.camera = new PerspectiveCamera(this);
            this.childAs(this._.scene);
            this.childAs(this._.camera);
            render(this, this._.scene, this._.camera);
            // this._.camera.position(0, 0, 5);
            // this._.camera.lookAt(0, 0, 0);
        } else {
            OrthographicCamera(this);
            PerspectiveCamera(this);
        }
        return this;
    },
    camera() {
        return this._.camera;
    },
};

function render(canvas, scene, camera) {
    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        precision: "highp",
        canvas: canvas.canvas().nake(),
    });
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    canvas.effect("size", () => {
        const width = canvas.width();
        const height = canvas.height();
        renderer.setSize(width, height, false);
        camera.resize(width, height);
    });
    renderer.setClearColor(C.white, 1);
    renderer.setAnimationLoop(() => {
        renderer.render(scene._.scene, camera._.camera);
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect(canvas.clientWidth / canvas.clientHeight);
        }
    });
    return renderer;
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) renderer.setSize(width, height, false);
    return needResize;
}
