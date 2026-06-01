// <sd-animation src="foo.html" [viewbox="x y w h"] [rate="1.01"] [description="..."]
//                [max-frame="N"] [args='{"k":"v"}']></sd-animation>
//
// Mounts an iframe pointing at `src` (a page produced by `gulp animation`), then
// drives the legacy postMessage IPC (SetViewBox / IFRAME_ID / IFRAME_URL /
// IFRAME_INITED / Flush / SetDescription / OnInited). Iframe gives every
// animation its own JS realm — no manual ctx threading inside @sd/core.
//
// Visibility-driven: the element observes its own intersection with the viewport.
// First time it becomes visible, the iframe mounts; subsequent enter/leave toggles
// resume/pause the animation tick. This makes <sd-animation> framework-agnostic —
// host frameworks (reveal, slidev, plain HTML, ...) do not need to wire slide
// lifecycle events to start/stop. Use the imperative show()/hide() to force the
// iframe to be (un)mounted, or start()/stop() to override the auto behavior.

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IPCMessage {
  operator: string;
  arguments: unknown[];
}

const VIEWBOX_CACHE = new Map<string, ViewBox>();
let idCounter = 0;

function parseBox(str: string | null): ViewBox | undefined {
  if (!str) return undefined;
  const v = str.split(/\s+/).map(Number);
  if (v.length !== 4 || v.some(isNaN)) return undefined;
  return { x: v[0], y: v[1], width: v[2], height: v[3] };
}

function isIPCMessage(x: unknown): x is IPCMessage {
  if (typeof x !== "object" || x === null) return false;
  const m = x as { operator?: unknown; arguments?: unknown };
  return typeof m.operator === "string" && Array.isArray(m.arguments);
}

export class SDElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      "src",
      "viewbox",
      "viewbox-delta",
      "rate",
      "description",
      "max-frame",
      "args",
    ];
  }

  private readonly frameId: string;
  private readonly shadow: ShadowRoot;
  private readonly messageHandler: (event: MessageEvent<unknown>) => void;
  private iframe: HTMLIFrameElement | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private mounted = false;

  constructor() {
    super();
    this.frameId = `sd_anim_${++idCounter}`;
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
            <style>
                :host { display: block; position: relative; width: 100%; height: 100%; }
                iframe { border: 0; width: 100%; height: 100%; display: block; background: transparent; }
            </style>
        `;
    this.messageHandler = (event) => this.onMessage(event);
  }

  connectedCallback(): void {
    window.addEventListener("message", this.messageHandler);
    // Defer one macrotask so host-side code has a chance to rewrite `src` to a
    // resolved path before the iframe is created. Without this, a same-tick src
    // mutation would cause a double-load.
    setTimeout(() => {
      if (!this.isConnected) return;
      this.intersectionObserver = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!this.mounted) this.mountIframe();
            else this.start();
          } else if (this.mounted) {
            this.stop();
          }
        }
      });
      this.intersectionObserver.observe(this);
    }, 0);
  }

  disconnectedCallback(): void {
    window.removeEventListener("message", this.messageHandler);
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    this.mounted = false;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (!this.mounted || !this.iframe) return;
    if (name === "src") {
      this.iframe.src = this.resolveSrc(newValue);
    }
    // Other attribute changes are picked up on next reload.
  }

  /** Force a reload of the underlying iframe — useful after attribute changes. */
  reload(): void {
    if (!this.iframe) return;
    this.iframe.src = this.resolveSrc(this.getAttribute("src"));
  }

  /** Resume the animation tick. */
  start(): void {
    this.post("StartAnimate", []);
  }

  /** Pause the animation tick. */
  stop(): void {
    this.post("StopAnimate", []);
  }

  /** Re-mount the iframe if it had been unmounted. */
  show(): void {
    if (!this.mounted) this.mountIframe();
    else this.start();
  }

  /** Drop the iframe entirely to free memory; use show() to bring it back. */
  hide(): void {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
      this.mounted = false;
    }
  }

  private resolveSrc(src: string | null): string {
    if (!src) return "";
    if (src.endsWith(".js")) src = src.replace(/\.js$/, ".html");
    if (
      src.startsWith("http") ||
      src.startsWith("/") ||
      src.startsWith("./animation") ||
      src.startsWith("animation")
    ) {
      return src;
    }
    // Honor the `location` ancestor convention used by include-html-style hosts
    // (see @sd/reveal's Include.ts): an injected fragment tags itself with
    // `location="<dir>"`, and child src paths are resolved relative to it.
    const base = this.findAncestorLocation();
    return base ? `${base}/${src}` : src;
  }

  private findAncestorLocation(): string | undefined {
    let node: Node | null = this.parentNode;
    while (node && node instanceof Element) {
      if (node.id === "slide-host") return undefined;
      const loc = node.getAttribute("location");
      if (loc) return loc;
      node = node.parentNode;
    }
    return undefined;
  }

  private mountIframe(): void {
    if (this.mounted) return;
    const src = this.getAttribute("src");
    if (!src) return;
    const iframe = document.createElement("iframe");
    iframe.id = this.frameId;
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.onload = () => this.onIframeLoaded();
    iframe.src = this.resolveSrc(src);
    this.shadow.appendChild(iframe);
    this.iframe = iframe;
    this.mounted = true;
  }

  private onIframeLoaded(): void {
    // Inside the iframe, sd.js Window.init() will post "inited" once ready.
    // We send OnInited to nudge in case it has already initialised.
    this.post("OnInited", []);
  }

  private onMessage(event: MessageEvent<unknown>): void {
    if (!this.iframe) return;
    if (event.source !== this.iframe.contentWindow) return;
    const data = event.data;
    if (data === "inited") {
      this.sendInit();
      return;
    }
    if (!isIPCMessage(data)) return;
    if (data.operator === "SetAnimationSize") {
      // [id, url, x, y, width, height]
      const [, url, x, y, width, height] = data.arguments as [
        unknown,
        string,
        number,
        number,
        number,
        number,
      ];
      VIEWBOX_CACHE.set(url, { x, y, width, height });
      this.applyViewBox();
      return;
    }
    if (data.operator === "ResetAnimationSize") {
      // currently unused; just re-init
      this.sendInit();
      return;
    }
  }

  private sendInit(): void {
    const src = this.resolveSrc(this.getAttribute("src"));
    const rate = +(this.getAttribute("rate") ?? "") || 1.01;
    const description = this.getAttribute("description");
    const argsAttr = this.getAttribute("args");
    const maxFrame = this.getAttribute("max-frame");
    const explicitVB = parseBox(this.getAttribute("viewbox"));
    const cachedVB = VIEWBOX_CACHE.get(src);
    const vb = explicitVB ?? cachedVB;
    const delta = parseBox(this.getAttribute("viewbox-delta"));

    if (vb) {
      const finalVB = delta
        ? {
            x: vb.x + delta.x,
            y: vb.y + delta.y,
            width: vb.width + delta.width,
            height: vb.height + delta.height,
          }
        : vb;
      this.post("SetViewBox", [
        finalVB.x,
        finalVB.y,
        finalVB.width,
        finalVB.height,
        rate,
      ]);
    }
    this.post("Message", ["IFRAME_ID", this.frameId]);
    this.post("Message", ["IFRAME_URL", src]);
    if (argsAttr) {
      try {
        this.post("Message", ["IFRAME_ARGS", JSON.parse(argsAttr)]);
      } catch {}
    }
    if (description) this.post("SetDescription", [description]);
    this.post("Message", ["IFRAME_INITED", true]);
    if (!vb) {
      // No known viewbox → run in "flush" (skip) mode to measure size; the
      // SetAnimationSize message comes back, then we cache and reload.
      const mf = maxFrame !== null ? Number(maxFrame) : Infinity;
      this.post("Flush", [this.frameId, src, rate, false, mf]);
    }
  }

  private applyViewBox(): void {
    // After measure mode reports SetAnimationSize, ask the inner sd.js to reload;
    // on the next "inited" we send the cached viewBox so the animation plays in
    // normal (non-flush) mode.
    this.post("Reload", []);
  }

  private post(operator: string, args: unknown[]): void {
    if (!this.iframe || !this.iframe.contentWindow) return;
    this.iframe.contentWindow.postMessage({ operator, arguments: args }, "*");
  }
}

if (typeof window !== "undefined" && window.customElements) {
  if (!window.customElements.get("sd-animation")) {
    window.customElements.define("sd-animation", SDElement);
  } else {
    console.warn(
      "[@sd/element] <sd-animation> already registered; this script load is a no-op.",
    );
  }
}
