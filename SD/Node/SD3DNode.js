import { SDNode } from "@/Node/SDNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export function SD3DNode(target) {
    SDNode.call(this, target);
}

SD3DNode.prototype = {
    ...SDNode.prototype,
    x() {
        ErrorLauncher.notImplementedYet("x", this.type());
    },
    y() {
        ErrorLauncher.notImplementedYet("y", this.type());
    },
    z() {
        ErrorLauncher.notImplementedYet("z", this.type());
    },
    lx() {
        ErrorLauncher.notImplementedYet("lx", this.type());
    },
    ly() {
        ErrorLauncher.notImplementedYet("ly", this.type());
    },
    lz() {
        ErrorLauncher.notImplementedYet("lz", this.type());
    },
    scale(scale) {
        if (this.fixAspect()) {
            this.lx(this.lx() * scale);
        } else {
            this.lx(this.lx() * scale);
            this.ly(this.ly() * scale);
            this.lz(this.lz() * scale);
        }
        return this;
    },
    pos(xLocator, yLocator, zLocator, dx = 0, dy = 0, dz = 0) {
        return [
            // vector 3
            this[xLocator]() + dx,
            this[yLocator]() + dy,
            this[zLocator]() + dz,
        ];
    },
    center(cx, cy, cz) {
        if (arguments.length === 0) {
            return this.pos("cx", "cy", "cz");
        } else if (arguments.length === 1) {
            return this.center(cx[0], cx[1], cx[2]);
        }
        this.freeze();
        this.cx(cx).cy(cy).cz(cz);
        this.unfreeze();
        return this;
    },
    kx(k) {
        return this.x() + this.lx() * k;
    },
    ky(k) {
        return this.y() + this.ly() * k;
    },
    kz(k) {
        return this.z() + this.lz() * k;
    },
    cx(cx) {
        if (cx === undefined) return this.kx(0.5);
        return this.x(cx - this.lx() * 0.5);
    },
    cy(cy) {
        if (cy === undefined) return this.ky(0.5);
        return this.y(cy - this.ly() * 0.5);
    },
    cz(cz) {
        if (cz === undefined) return this.kz(0.5);
        return this.z(cz - this.lz() * 0.5);
    },
    mx(mx) {
        if (mx === undefined) return this.kx(1);
        return this.x(mx - this.lx());
    },
    my(my) {
        if (my === undefined) return this.ky(1);
        return this.y(my - this.ly());
    },
    mz(mz) {
        if (mz === undefined) return this.kz(1);
        return this.z(mz - this.lz());
    },
};
