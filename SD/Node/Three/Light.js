import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { Scene } from "@/Node/Three/Scene";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { DirectionalLight } from "three";

export function Light(parent) {
    if (parent instanceof Scene) ErrorLauncher.invalidArguments();
    SDNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 10,
        z: 10,
    });

    this._.scene = parent._.scene;
    this._.light = new DirectionalLight(0xffffff, 1);
    this._.light.position.set(0, 10, 10);
    this._.scene.add(this._.light);

    this.vars.associate("x", Factory.action(this, this._.light.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.light.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.light.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.light.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.light.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.light.rotation, "z", Interp.numberInterp));
}
