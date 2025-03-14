import { Canvas } from "@/Node/HTML/Canvas";
import { SDNode } from "@/Node/SDNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Scene as S } from "three";

export function Scene(canvas) {
    if (!(canvas instanceof Canvas)) ErrorLauncher.invalidArguments();
    SDNode.call(this, canvas);

    this._.scene = new S();
}

Scene.prototype = {
    ...Scene.prototype,
    add(element) {
        this._.scene.add(element);
    },
};
