import { Interp } from "@/Animate/Interp";
import { Canvas } from "@/Node/HTML/Canvas";
import { BaseThree } from "@/Node/Three/BaseThree";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";

export function Camera(canvas) {
    if (!(canvas instanceof Canvas)) ErrorLauncher.invalidArguments();
    BaseThree.call(this, canvas);

    this.vars.merge({
        frustumSize: 6,
        x: 5,
        y: 5,
        z: 5,
    });
    const width = canvas.width();
    const height = canvas.height();
    const aspect = width / height;
    this._.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this._.camera.position.set(5, 5, 5);
    this._.camera.lookAt(new Vector3(0, 0, 0));

    this.vars.rx = this._.camera.rotation.x;
    this.vars.ry = this._.camera.rotation.y;
    this.vars.rz = this._.camera.rotation.z;

    this.vars.associate("x", Factory.action(this, this._.camera.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.camera.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.camera.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.camera.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.camera.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.camera.rotation, "z", Interp.numberInterp));
    return;
    this._.camera = new OrthographicCamera((this.vars.frustumSize * aspect) / -2, (this.vars.frustumSize * aspect) / 2, this.frustumSize / 2, this.frustumSize / -2, 0.1, 1000);
    this._.camera.position.set(5, 5, 5);
    this._.camera.lookAt(new Vector3(0, 0, 0));
}

Camera.prototype = {
    ...BaseThree.prototype,
};
