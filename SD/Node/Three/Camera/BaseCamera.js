import { Action } from "@/Animate/Action";
import { BaseThree } from "@/Node/Three/BaseThree";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseCamera(target) {
    BaseThree.call(this, target);

    this.vars.merge({
        z: 5,
        direction: [0, 0, -1],
        near: 0.1,
        far: 1000,
    });

    const self = this;
    this.vars.associate("direction", function (newValue, oldValue) {
        new Action(
            self.delay(),
            self.delay() + self.duration(),
            oldValue,
            newValue,
            function (k) {
                const s = this.source;
                const t = this.target;
                const tmp = [s[0] + (t[0] - s[0]) * k, s[1] + (t[1] - s[1]) * k, s[2] + (t[2] - s[2]) * k];
                const p = self._.camera.position;
                const answer = [p.x + tmp[0], p.y + tmp[1], p.z + tmp[2]];
                self._.camera.lookAt(answer[0], answer[1], answer[2]);
            },
            this,
            "direction"
        );
    });
}

BaseCamera.prototype = {
    ...BaseThree.prototype,
    BASE_CAMERA: true,
    near: Factory.handlerMediumPrecise("near"),
    far: Factory.handlerLowPrecise("far"),
    resize() {
        ErrorLauncher.notImplementedYet("resize", this.type());
    },
    lookAt(x, y, z) {
        this._.camera.lookAt(x, y, z);
        return this;
    },
    direction(x, y, z) {
        if (arguments.length === 0) return this.vars.direction;
        if (arguments.length === 1) return this.direction(x[0], x[1], x[2]);
        this.vars.direction = [x, y, z];
        return this;
    },
};
