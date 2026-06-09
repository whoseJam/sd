type DeviceCallback = () => void;

// Horizontal swipe distance (in px) required to count as a navigation gesture.
// Below this, treat as a tap / vertical jitter and ignore.
const SWIPE_MIN_DX = 50;
// |dx| must dominate |dy| by this factor — otherwise it's a vertical scroll.
const SWIPE_AXIS_RATIO = 1.5;

export class Device {
  static deviceMap = {};
  static deviceOnceMap = {};
  static init() {
    document.addEventListener("keydown", (event) => {
      if (this.deviceMap[event.key]) this.deviceMap[event.key]();
      if (this.deviceOnceMap[event.key]) {
        this.deviceOnceMap[event.key]();
        this.deviceOnceMap[event.key] = undefined;
      }
    });

    // Mobile: horizontal swipe mirrors N/P. Finger left → N (next),
    // finger right → P (prev). Single-finger only; ignore touches that
    // start on an interactive control so Slider/Button still work.
    let startX = 0;
    let startY = 0;
    let tracking = false;
    document.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) {
          tracking = false;
          return;
        }
        const target = event.target as Element | null;
        if (target && target.closest("button, input, select, textarea")) {
          tracking = false;
          return;
        }
        tracking = true;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      },
      { passive: true },
    );
    document.addEventListener(
      "touchend",
      (event) => {
        if (!tracking) return;
        tracking = false;
        const touch = event.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.abs(dx) < SWIPE_MIN_DX) return;
        if (Math.abs(dx) < SWIPE_AXIS_RATIO * Math.abs(dy)) return;
        this.keyDown(dx < 0 ? "N" : "P");
      },
      { passive: true },
    );
  }
  static onKeyDown(key: string, callback: DeviceCallback): void;
  static onKeyDown(key: string, cancel: null | undefined | false): void;
  static onKeyDown(
    key: string,
    callback: DeviceCallback | null | undefined | false,
  ) {
    for (const k of key) this.deviceMap[k] = callback;
  }
  static onKeyDownOnce(key: string, callback: DeviceCallback): void;
  static onKeyDownOnce(key: string, cancel: null | undefined | false): void;
  static onKeyDownOnce(
    key: string,
    callback: DeviceCallback | null | undefined | false,
  ) {
    for (const k of key) this.deviceOnceMap[k] = callback;
  }
  static keyDown(key: string) {
    if (this.deviceMap[key]) this.deviceMap[key]();
    if (this.deviceOnceMap[key]) {
      this.deviceOnceMap[key]();
      this.deviceOnceMap[key] = undefined;
    }
  }
}

export function device() {
  return Device;
}
