import { Interp } from "@/Animate/Interp";
import { BaseShape3D } from "@/Node/Three/Shape/BaseShape3D";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { BufferGeometry, DoubleSide, LineBasicMaterial, Line as LineFromThree, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three";

export function Rect3D(target) {
    BaseShape3D.call(this, target);

    this.vars.merge({
        z: 0,
        width: 1,
        height: 1,
    });
    this._.width = 1;
    this._.height = 1;

    const fillGeometry = createFillGeometry(this.vars.width, this.vars.height);
    const fillMaterial = new MeshBasicMaterial({ color: C.white });
    this._.fill = new Mesh(fillGeometry, fillMaterial);
    const strokeGeometry = createStrokeGeometry(this.vars.width, this.vars.height);
    const strokeMaterial = new LineBasicMaterial({ color: C.black, side: DoubleSide });
    this._.stroke = new LineFromThree(strokeGeometry, strokeMaterial);
    this._.scene.add(this._.fill);
    this._.scene.add(this._.stroke);

    const sizeHelper = createSizeHelper(this, this._.fill, this._.stroke);
    this.vars.associate("cx", Factory.action(this, this._.fill.position, "x", Interp.numberInterp));
    this.vars.associate("cx", Factory.action(this, this._.stroke.position, "x", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.fill.position, "y", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.stroke.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.fill.position, "z", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.stroke.position, "z", Interp.numberInterp));
    this.vars.associate("width", Factory.action(this, sizeHelper, "width", Interp.numberInterp));
    this.vars.associate("height", Factory.action(this, sizeHelper, "height", Interp.numberInterp));
}

Rect3D.prototype = {
    ...BaseShape3D.prototype,
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
};

function createSizeHelper(rect, fill, stroke) {
    return {
        setAttribute(key, value) {
            rect._[key] = value;
            fill.geometry.dispose();
            fill.geometry = createFillGeometry(rect._.width, rect._.height);
            stroke.geometry.dispose();
            stroke.geometry = createStrokeGeometry(rect._.width, rect._.height);
        },
    };
}

function createFillGeometry(width, height) {
    return new PlaneGeometry(width, height);
}

function createStrokeGeometry(width, height) {
    return new BufferGeometry().setFromPoints([
        // format
        new Vector3(width / -2, height / -2, 0),
        new Vector3(width / -2, height / 2, 0),
        new Vector3(width / 2, height / 2, 0),
        new Vector3(width / 2, height / -2, 0),
        new Vector3(width / -2, height / -2, 0),
    ]);
}
