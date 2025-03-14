import { Canvas } from "@/Node/HTML/Canvas";
import { SDNode } from "@/Node/SDNode";
import { Color as C } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { WebGLRenderer } from "three";

export function Renderer(canvas) {
    if (!(canvas instanceof Canvas)) ErrorLauncher.invalidArguments();
    SDNode.call(this, canvas);

    const width = canvas.width();
    const height = canvas.height();
    this._.renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        precision: "highp",
        canvas: canvas.canvas().nake(),
    });
    this._.renderer.setPixelRatio(window.devicePixelRatio);
    this._.renderer.setSize(width, height);
    this._.renderer.setClearColor(C.white, 1);
}

Renderer.prototype = {
    ...Renderer.prototype,
    start(scene, camera) {
        [scene, camera] = [scene._.scene, camera._.camera];
        this._.renderer.setAnimationLoop(() => {
            this._.renderer.render(scene, camera);
        });
    },
};
