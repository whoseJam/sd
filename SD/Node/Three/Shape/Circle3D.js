import { Interp } from "@/Animate/Interp";
import { BaseShape3D } from "@/Node/Three/Shape/BaseShape3D";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { BufferGeometry, CircleGeometry, DoubleSide, LineBasicMaterial, Line as LineFromThree, Mesh, MeshBasicMaterial, Vector3 } from "three";

const segmentCount = 128;

function getPolygonVertices(r) {
    const vertices = [];
    for (let i = 0; i <= segmentCount; i++) {
        const v = new Vector3(
            // format
            r * Math.sin((2 * i * Math.PI) / segmentCount),
            r * Math.cos((2 * i * Math.PI) / segmentCount),
            0
        );
        vertices.push(v);
    }
    return vertices;
}

export function Circle3D(target) {
    BaseShape3D.call(this, target);

    this.vars.merge({
        z: 0,
        r: 0.5,
    });

    const fillGeometry = createFillGeometry(this.vars.r);
    const fillMaterial = new MeshBasicMaterial({ color: C.white, side: DoubleSide });
    this._.fill = new Mesh(fillGeometry, fillMaterial);
    const strokeGeometry = createStrokeGeometry(this.vars.r);
    const strokeMaterial = new LineBasicMaterial({ color: C.black, side: DoubleSide });
    this._.stroke = new LineFromThree(strokeGeometry, strokeMaterial);
    this._.scene.add(this._.fill);
    this._.scene.add(this._.stroke);

    const radiusHelper = createRadiusHelper(this._.fill, this._.stroke);
    this.vars.associate("cx", Factory.action(this, this._.fill.position, "x", Interp.numberInterp));
    this.vars.associate("cx", Factory.action(this, this._.stroke.position, "x", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.fill.position, "y", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.stroke.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.fill.position, "z", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.stroke.position, "z", Interp.numberInterp));
    this.vars.associate("r", Factory.action(this, radiusHelper, "r", Interp.numberInterp));
}

Circle3D.prototype = {
    ...BaseShape3D.prototype,
    width(width) {
        if (arguments.length === 0) return this.r() * 2;
        return this.r(width / 2);
    },
    height(height) {
        if (arguments.length === 0) return this.r() * 2;
        return this.r(height / 2);
    },
    r: Factory.handlerLowPrecise("r"),
};

function createRadiusHelper(fill, stroke) {
    return {
        setAttribute(key, value) {
            fill.geometry.dispose();
            fill.geometry = createFillGeometry(value);
            stroke.geometry.dispose();
            stroke.geometry = createStrokeGeometry(value);
        },
    };
}

function createFillGeometry(r) {
    return new CircleGeometry(r, segmentCount);
}

function createStrokeGeometry(r) {
    return new BufferGeometry().setFromPoints(getPolygonVertices(r));
}
