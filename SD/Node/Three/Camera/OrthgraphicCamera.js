import { Interp } from "@/Animate/Interp";
import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";
import { Factory } from "@/Utility/Factory";
import { OrthographicCamera as OrthographicCameraFromThree } from "three";

export function OrthographicCamera(target) {
    BaseCamera.call(this, target);

    this.vars.merge({
        left: -5,
        right: 5,
        top: 2.5,
        bottom: -2.5,
    });

    this._.camera = new OrthographicCameraFromThree(this.vars.left, this.vars.right, this.vars.top, this.vars.bottom, this.vars.near, this.vars.far);
    this._.camera.position.set(this.vars.x, this.vars.y, this.vars.z);
    this._.camera.lookAt(0, 0, 0);

    this.vars.associate("x", Factory.action(this, this._.camera.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.camera.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.camera.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.camera.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.camera.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.camera.rotation, "z", Interp.numberInterp));
    this.vars.associate("left", Factory.actionForCamera(this, this._.camera, "left", Interp.numberInterp));
    this.vars.associate("right", Factory.actionForCamera(this, this._.camera, "right", Interp.numberInterp));
    this.vars.associate("top", Factory.actionForCamera(this, this._.camera, "top", Interp.numberInterp));
    this.vars.associate("bottom", Factory.actionForCamera(this, this._.camera, "bottom", Interp.numberInterp));
    this.vars.associate("near", Factory.action(this, this._.camera, "near", Interp.numberInterp));
    this.vars.associate("far", Factory.action(this, this._.camera, "far", Interp.numberInterp));
}

OrthographicCamera.prototype = {
    ...BaseCamera.prototype,
    left: Factory.handlerLowPrecise("left"),
    right: Factory.handlerLowPrecise("right"),
    top: Factory.handlerLowPrecise("top"),
    bottom: Factory.handlerLowPrecise("bottom"),
    resize(width, height) {
        const scale = 45;
        this.left(width / -2 / scale).right(width / 2 / scale);
        this.top(height / 2 / scale).bottom(height / -2 / scale);
        return this;
    },
};
