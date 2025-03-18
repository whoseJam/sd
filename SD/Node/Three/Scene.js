import { Canvas } from "@/Node/HTML/Canvas";
import { SD3DNode } from "@/Node/SD3DNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Scene as S } from "three";

export function Scene(canvas) {
    if (!(canvas instanceof Canvas)) ErrorLauncher.invalidArguments();
    SD3DNode.call(this, canvas);

    this._.scene = new S();
}

Scene.prototype = {
    ...SD3DNode.prototype,
    add(element) {
        this._.scene.add(element);
    },
};
