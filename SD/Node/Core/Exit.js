import { svg } from "@/Interact/Root";

export class Exit {
    static fade() {
        return function (element) {
            element.opacity(0);
            element.remove();
        };
    }
    static drop(parent, child) {
        if (arguments.length === 2) {
            return function () {
                const erase = typeof child === "string" ? parent.child(child) : child;
                if (!erase) return;
                erase.after(parent.delay());
                erase.attachTo(svg());
            };
        }
        return function (element) {
            element.after(this.delay());
            element.attachTo(svg());
        };
    }
}

export function exit() {
    return Exit;
}
