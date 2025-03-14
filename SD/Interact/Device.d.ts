export class Device {
    static init();
    static onKeyDown(key: string, callback: () => void): void;
    static onKeyDown(key: string, callback: null | undefined | false): void;
    static onKeyDownOnce(key: string, callback: () => void): void;
    static onKeyDownOnce(key: string, callback: null | undefined | false): void;
}

export function device(): typeof Device;
