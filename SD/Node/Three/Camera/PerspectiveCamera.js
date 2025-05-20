import { Interp } from "@/Animate/Interp";
import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";
import { Factory } from "@/Utility/Factory";
import { PerspectiveCamera as PerspectiveCameraFromThree } from "three";

export function PerspectiveCamera(target) {
    BaseCamera.call(this, target);

    this.vars.merge({
        fov: 75,
        aspect: 400 / 300,
    });

    this._.camera = new PerspectiveCameraFromThree(this.vars.fov, this.vars.aspect, this.vars.near, this.vars.far);
    this._.camera.position.set(this.vars.x, this.vars.y, this.vars.z);
    this._.camera.lookAt(0, 0, 0);

    this.vars.associate("x", Factory.action(this, this._.camera.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.camera.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.camera.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.camera.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.camera.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.camera.rotation, "z", Interp.numberInterp));
    this.vars.associate("fov", Factory.action(this, this._.camera, "fov", Interp.numberInterp));
    this.vars.associate("aspect", Factory.actionForCamera(this, this._.camera, "aspect", Interp.numberInterp));
    this.vars.associate("near", Factory.action(this, this._.camera, "near", Interp.numberInterp));
    this.vars.associate("far", Factory.action(this, this._.camera, "far", Interp.numberInterp));
}

PerspectiveCamera.prototype = {
    ...BaseCamera.prototype,
    aspect: Factory.handlerMediumPrecise("aspect"),
    resize(width, height) {
        this.aspect(width / height);
        return this;
    },
};
