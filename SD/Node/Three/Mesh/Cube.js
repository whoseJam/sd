import { Interp } from "@/Animate/Interp";
import { BaseThree } from "@/Node/Three/BaseThree";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { BoxGeometry, Mesh, MeshToonMaterial } from "three";

export function Cube(parent) {
    BaseThree.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        color: C.pureGreen,
    });
    this._.geometry = new BoxGeometry(1, 1, 1);
    this._.material = new MeshToonMaterial({ color: C.pureGreen });
    this._.mesh = new Mesh(this._.geometry, this._.material);
    this._.scene.add(this._.mesh);

    this.vars.associate("x", Factory.action(this, this._.mesh.position, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.mesh.position, "y", Interp.numberInterp));
    this.vars.associate("z", Factory.action(this, this._.mesh.position, "z", Interp.numberInterp));
    this.vars.associate("rx", Factory.action(this, this._.mesh.rotation, "x", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.mesh.rotation, "y", Interp.numberInterp));
    this.vars.associate("rz", Factory.action(this, this._.mesh.rotation, "z", Interp.numberInterp));
    this.vars.associate("color", Factory.action(this, this._.material, "color", Interp.normalizedColorInterp));
}

Cube.prototype = {
    ...BaseThree.prototype,
    color: Factory.handler("color"),
};
