// <sd-animation src="foo.html" [viewbox="x y w h"] [rate="1.01"] [description="..."]
//                [max-frame="N"] [lazy] [args='{"k":"v"}']></sd-animation>
//
// Mounts an iframe pointing at `src` (a page produced by `gulp animation`), then
// drives the legacy postMessage IPC (SetViewBox / IFRAME_ID / IFRAME_URL /
// IFRAME_INITED / Flush / SetDescription / OnInited). Iframe gives every
// animation its own JS realm — no manual ctx threading inside @sd/core.

const VIEWBOX_CACHE = new Map(); // src -> {x, y, width, height}
let _idCounter = 0;

function parseBox(str) {
  if (!str) return undefined;
  const v = str.split(/\s+/).map(Number);
  if (v.length !== 4 || v.some(isNaN)) return undefined;
  return { x: v[0], y: v[1], width: v[2], height: v[3] };
}

export class SDAnimationElement extends HTMLElement {
  static get observedAttributes() {
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

  constructor() {
    super();
    this._frameId = `sd_anim_${++_idCounter}`;
    this._shadow = this.attachShadow({ mode: "open" });
    this._shadow.innerHTML = `
            <style>
                :host { display: block; position: relative; width: 100%; height: 100%; }
                iframe { border: 0; width: 100%; height: 100%; display: block; background: transparent; }
            </style>
        `;
    this._iframe = null;
    this._messageHandler = this._onMessage.bind(this);
    this._intersectionObserver = null;
    this._mounted = false;
  }

  connectedCallback() {
    window.addEventListener("message", this._messageHandler);
    // Defer mount one macrotask so host-side plugins (e.g. @sd/reveal's
    // SDAnimation) get a chance to rewrite `src` to a resolved path before
    // the iframe is created. Without this, we'd load once with the raw src
    // and immediately reload with the resolved one.
    setTimeout(() => {
      if (!this.isConnected || this._mounted) return;
      if (this.hasAttribute("lazy")) {
        this._intersectionObserver = new IntersectionObserver((entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              this._mountIframe();
              this._intersectionObserver.disconnect();
              this._intersectionObserver = null;
              break;
            }
          }
        });
        this._intersectionObserver.observe(this);
      } else {
        this._mountIframe();
      }
    }, 0);
  }

  disconnectedCallback() {
    window.removeEventListener("message", this._messageHandler);
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }
    if (this._iframe) {
      this._iframe.remove();
      this._iframe = null;
    }
    this._mounted = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (!this._mounted) return;
    if (name === "src") {
      this._iframe.src = this._resolveSrc(newValue);
    }
    // Other attribute changes are picked up on next reload.
  }

  /** Force a reload of the underlying iframe — useful after attribute changes. */
  reload() {
    if (!this._iframe) return;
    this._iframe.src = this._resolveSrc(this.getAttribute("src"));
  }

  /** Resume the animation tick (used e.g. when a reveal slide becomes active). */
  start() {
    this._post("StartAnimate", []);
  }

  /** Pause the animation tick. */
  stop() {
    this._post("StopAnimate", []);
  }

  /** Re-mount the iframe if it had been unmounted. */
  show() {
    if (!this._mounted) this._mountIframe();
    else this.start();
  }

  /** Drop the iframe entirely to free memory; use show() to bring it back. */
  hide() {
    if (this._iframe) {
      this._iframe.remove();
      this._iframe = null;
      this._mounted = false;
    }
  }

  _resolveSrc(src) {
    if (!src) return "";
    if (src.endsWith(".js")) src = src.replace(/\.js$/, ".html");
    return src;
  }

  _mountIframe() {
    if (this._mounted) return;
    const src = this.getAttribute("src");
    if (!src) return;
    const iframe = document.createElement("iframe");
    iframe.id = this._frameId;
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.onload = () => this._onIframeLoaded();
    iframe.src = this._resolveSrc(src);
    this._shadow.appendChild(iframe);
    this._iframe = iframe;
    this._mounted = true;
  }

  _onIframeLoaded() {
    // Inside the iframe, sd.js Window.init() will post "inited" once ready.
    // We send OnInited to nudge in case it has already initialised.
    this._post("OnInited", []);
  }

  _onMessage(event) {
    if (!this._iframe) return;
    if (event.source !== this._iframe.contentWindow) return;
    const data = event.data;
    if (data === "inited") {
      this._sendInit();
      return;
    }
    if (data && data.operator === "SetAnimationSize") {
      // [id, url, x, y, width, height]
      const [, url, x, y, width, height] = data.arguments;
      const box = { x, y, width, height };
      VIEWBOX_CACHE.set(url, box);
      this._applyViewBox(box);
      return;
    }
    if (data && data.operator === "ResetAnimationSize") {
      // currently unused; just re-init
      this._sendInit();
      return;
    }
  }

  _sendInit() {
    const src = this._resolveSrc(this.getAttribute("src"));
    const rate = +this.getAttribute("rate") || 1.01;
    const description = this.getAttribute("description");
    const argsAttr = this.getAttribute("args");
    const maxFrame = this.getAttribute("max-frame");
    const explicitVB = parseBox(this.getAttribute("viewbox"));
    const cachedVB = VIEWBOX_CACHE.get(src);
    const vb = explicitVB ?? cachedVB;
    const delta = parseBox(this.getAttribute("viewbox-delta"));

    if (vb) {
      const final = delta
        ? {
            x: vb.x + delta.x,
            y: vb.y + delta.y,
            width: vb.width + delta.width,
            height: vb.height + delta.height,
          }
        : vb;
      this._post("SetViewBox", [
        final.x,
        final.y,
        final.width,
        final.height,
        rate,
      ]);
    }
    this._post("Message", ["IFRAME_ID", this._frameId]);
    this._post("Message", ["IFRAME_URL", src]);
    if (argsAttr) {
      try {
        this._post("Message", ["IFRAME_ARGS", JSON.parse(argsAttr)]);
      } catch {}
    }
    if (description) this._post("SetDescription", [description]);
    this._post("Message", ["IFRAME_INITED", true]);
    if (!vb) {
      // No known viewbox → run in "flush" (skip) mode to measure size; the
      // SetAnimationSize message will come back, then we cache and (optionally) reload.
      const mf = maxFrame !== null ? Number(maxFrame) : Infinity;
      this._post("Flush", [this._frameId, src, rate, false, mf]);
    }
  }

  _applyViewBox(_box) {
    // After measure mode reports SetAnimationSize, ask the inner sd.js to reload
    // itself; on the next "inited" we'll send the cached viewBox so the animation
    // plays in normal (non-flush) mode.
    this._post("Reload", []);
  }

  _post(operator, args) {
    if (!this._iframe || !this._iframe.contentWindow) return;
    this._iframe.contentWindow.postMessage({ operator, arguments: args }, "*");
  }
}

if (typeof window !== "undefined" && window.customElements) {
  if (!window.customElements.get("sd-animation")) {
    window.customElements.define("sd-animation", SDAnimationElement);
  } else {
    console.warn(
      "[@sd/element] <sd-animation> already registered; this script load is a no-op.",
    );
  }
}
