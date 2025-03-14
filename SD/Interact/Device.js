export class Device {
    static deviceMap = {};
    static deviceOnceMap = {};
    static init() {
        document.addEventListener("keydown", event => {
            if (this.deviceMap[event.key]) {
                this.deviceMap[event.key]();
            }
            if (this.deviceOnceMap[event.key]) {
                this.deviceOnceMap[event.key]();
                this.deviceOnceMap[event.key] = undefined;
            }
        });
    }
    static onKeyDown(key, callback) {
        this.deviceMap[key] = callback;
    }
    static onKeyDownOnce(key, callback) {
        this.deviceOnceMap[key] = callback;
    }
}

export function device() {
    return Device;
}
