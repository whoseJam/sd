import { svg } from "@/Interact/Root";
import { afterEffect } from "@/Node/Core/Reactive";

export class Enter {
    static nothing(layer) {
        return function (element, move) {
            move();
            afterEffect(() => {
                element.startAnimate(this);
            });
        };
    }
    static appear(layer) {
        return function (element, move) {
            element.after(this.delay());
            element.opacity(0);
            element.attachTo(this.layer(layer));
            move();
            afterEffect(() => {
                element.startAnimate(this);
                element.opacity(1);
            });
        };
    }
    static pointStoT(layer) {
        return function (element, move) {
            element.after(this.delay());
            element.opacity(0);
            element.attachTo(this.layer(layer));
            move();
            afterEffect(() => {
                element.after(this);
                element.opacity(1);
                element.startAnimate(this);
                element.pointStoT();
            });
        };
    }
    static moveTo(layer) {
        return function (element, move) {
            element.after(this.delay());
            element.attachTo(svg());
            element.startAnimate(this);
            move();
            element.attachTo(this.layer(layer));
            element.opacity(1);
        };
    }
}

export function enter() {
    return Enter;
}
