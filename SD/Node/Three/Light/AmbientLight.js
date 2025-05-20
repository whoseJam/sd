import { Interp } from "@/Animate/Interp";
import { BaseLight } from "@/Node/Three/Light/BaseLight";
import { Factory } from "@/Utility/Factory";
import { AmbientLight as AmbientLightFromThree } from "three";

export function AmbientLight(target) {
    BaseLight.call(this, target);

    this._.light = new AmbientLightFromThree(this.vars.color);
    this._.scene.add(this._.light);

    this.vars.associate("color", Factory.action(this, this._.light, "color", Interp.normalizedColorInterp));
    this.vars.associate("intensity", Factory.action(this, this._.light, "intensity", Interp.numberInterp));
}

AmbientLight.prototype = {
    ...BaseLight.prototype,
};
