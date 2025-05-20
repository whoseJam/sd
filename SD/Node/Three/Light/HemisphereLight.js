import { Interp } from "@/Animate/Interp";
import { BaseLight } from "@/Node/Three/Light/BaseLight";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";
import { HemisphereLight as HemisphereLightFromThree } from "three";

export function HemisphereLight(target) {
    BaseLight.call(this, target);

    this.vars.merge({
        skyColor: C.white,
        groundColor: C.white,
    });

    this._.light = new HemisphereLightFromThree(this.vars.skyColor, this.vars.groundColor, this.vars.intensity);
    this._.scene.add(this._.light);

    this.vars.associate("skyColor", Factory.action(this, this._.light, "skyColor", Interp.normalizedColorInterp));
    this.vars.associate("groundColor", Factory.action(this, this._.light, "groundColor", Interp.normalizedColorInterp));
}

HemisphereLight.prototype = {
    ...BaseLight.prototype,
    color(color) {
        return this.skyColor(color).groundColor(color);
    },
    skyColor: Factory.handler("skyColor"),
    groundColor: Factory.handler("groundColor"),
};
