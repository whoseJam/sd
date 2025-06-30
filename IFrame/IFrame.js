const iframesMap = new Map();
const cache = {};
let globalArgs = {
    getURL(iframe) {
        let url = iframe.getAttribute("data-animation");
        if (url.endsWith(".js")) url = url.replace(".js", ".html");
        return url;
    },
};
let id = 0;

function getAttribute(iframe, key, _default = undefined) {
    const value = iframe.getAttribute(key);
    if (value === undefined || value === null) return _default;
    return value;
}

function getBox(str) {
    if (str === undefined) return undefined;
    const values = str.split(" ");
    return {
        x: +values[0],
        y: +values[1],
        width: +values[2],
        height: +values[3],
    };
}

window.SetAnimationSize = function (id, url, x, y, width, height) {
    const iframe = document.getElementById(id);
    const iframeManager = iframesMap.get(iframe);
    iframeManager.reload(x, y, width, height);
};

window.ResetAnimationSize = function (id, url) {
    const iframe = document.getElementById(id);
    const iframeManager = iframesMap.get(iframe);
    iframeManager.reload();
};

window.addEventListener("message", event => {
    const data = event.data;
    if (data.operator && data.arguments) {
        window[data.operator].apply(window, data.arguments);
    }
});

class IFrameManager {
    constructor(iframe) {
        this.iframe = iframe;
        if (!iframe.id) iframe.id = `iframe_${++id}`;
        this.id = this.iframe.id;
        this.url = globalArgs.getURL ? globalArgs.getURL(iframe) : getAttribute(iframe, "data-animation");
        this.rate = getAttribute(iframe, "data-rate", 1.01);
        this.args = iframe.onsubmit;
        this.viewBox = getBox(getAttribute(iframe, "data-viewBox"));
        this.viewBoxDelta = getBox(getAttribute(iframe, "data-viewBoxDelta"));
        this.maxFrame = getAttribute(iframe, "data-maxFrame", Infinity);
        if (!globalArgs.lazy) {
            this.onVisible();
        }
    }

    onVisible() {
        if (this.hasViewBox()) {
            const viewBox = this.getViewBox();
            this.iframe.onload = () => {
                const callback = event => {
                    if (event && event.source !== this.iframe.contentWindow) return;
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "SetViewBox",
                            arguments: [viewBox.x, viewBox.y, viewBox.width, viewBox.height, this.rate],
                        },
                        "*"
                    );
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_ID", this.id],
                        },
                        "*"
                    );
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_URL", this.url],
                        },
                        "*"
                    );
                    if (this.args)
                        this.iframe.contentWindow.postMessage(
                            {
                                operator: "Message",
                                arguments: ["IFRAME_ARGS", this.args()],
                            },
                            "*"
                        );
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_INITED", true],
                        },
                        "*"
                    );
                    window.removeEventListener("message", callback);
                };
                window.addEventListener("message", callback);
                this.iframe.contentWindow.postMessage(
                    {
                        operator: "OnInited",
                        arguments: [],
                    },
                    "*"
                );
            };
        } else {
            this.iframe.onload = () => {
                const callback = event => {
                    if (event && event.source !== this.iframe.contentWindow) return;
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_ID", this.id],
                        },
                        "*"
                    );
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_URL", this.url],
                        },
                        "*"
                    );
                    if (this.args)
                        iframe.contentWindow.postMessage(
                            {
                                operator: "Message",
                                arguments: ["IFRAME_ARGS", this.args()],
                            },
                            "*"
                        );
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_INITED", true],
                        },
                        "*"
                    );
                    this.iframe.contentWindow.postMessage(
                        {
                            operator: "Flush",
                            arguments: [this.id, this.url, this.rate, false, this.maxFrame],
                        },
                        "*"
                    );
                    window.removeEventListener("message", callback);
                };
                window.addEventListener("message", callback);
                this.iframe.contentWindow.postMessage(
                    {
                        operator: "OnInited",
                        arguments: [],
                    },
                    "*"
                );
            };
        }
        this.iframe.setAttribute("src", this.url);
    }

    onHidden() {
        this.iframe.setAttribute("src", "");
    }

    hasViewBox() {
        if (this.viewBox !== undefined) return true;
        if (cache[this.url] !== undefined && !this.args) return true;
        return false;
    }

    getViewBox(x, y, width, height) {
        let viewBox = undefined;
        if (this.viewBox) {
            viewBox = this.viewBox;
        } else if (cache[this.url]) {
            viewBox = cache[this.url];
        } else if (arguments.length === 4) {
            viewBox = { x, y, width, height };
        }
        if (viewBox === undefined) throw new Error("View Box Information Not Found!");
        if (this.viewBoxDelta) {
            viewBox = {
                x: viewBox.x + this.viewBoxDelta.x,
                y: viewBox.y + this.viewBoxDelta.y,
                width: viewBox.width + this.viewBoxDelta.width,
                height: viewBox.height + this.viewBoxDelta.height,
            };
        }
        return viewBox;
    }

    reload(x, y, width, height) {
        if (!this.args && !cache[this.url] && arguments.length === 4) {
            const viewBox = {
                x,
                y,
                width,
                height,
            };
            cache[this.url] = viewBox;
        }
        const viewBox = this.getViewBox.apply(this, arguments);
        this.iframe.onload = () => {
            const callback = event => {
                if (event && event.source !== this.iframe.contentWindow) return;
                this.iframe.contentWindow.postMessage(
                    {
                        operator: "SetViewBox",
                        arguments: [viewBox.x, viewBox.y, viewBox.width, viewBox.height, this.rate],
                    },
                    "*"
                );
                this.iframe.contentWindow.postMessage(
                    {
                        operator: "Message",
                        arguments: ["IFRAME_ID", this.id],
                    },
                    "*"
                );
                this.iframe.contentWindow.postMessage(
                    {
                        operator: "Message",
                        arguments: ["IFRAME_URL", this.url],
                    },
                    "*"
                );
                if (this.args)
                    iframe.contentWindow.postMessage(
                        {
                            operator: "Message",
                            arguments: ["IFRAME_ARGS", this.args()],
                        },
                        "*"
                    );
                this.iframe.contentWindow.postMessage(
                    {
                        operator: "Message",
                        arguments: ["IFRAME_INITED", true],
                    },
                    "*"
                );
                window.removeEventListener("message", callback);
            };
            window.addEventListener("message", callback);
            this.iframe.contentWindow.postMessage(
                {
                    operator: "OnInited",
                    arguments: [],
                },
                "*"
            );
        };
        this.iframe.contentWindow.postMessage(
            {
                operator: "Reload",
                arguments: [],
            },
            "*"
        );
    }

    startAnimateRequest() {
        this.iframe.contentWindow.postMessage(
            {
                operator: "StartAnimate",
                arguments: [],
            },
            "*"
        );
    }

    stopAnimateRequest() {
        this.iframe.contentWindow.postMessage(
            {
                operator: "StopAnimate",
                arguments: [],
            },
            "*"
        );
    }
}

export function configure(args) {
    globalArgs = args;
}

export function init(dom) {
    const iframes = dom.querySelectorAll("iframe[data-animation]");
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframesMap.set(iframe, new IFrameManager(iframe));
    }
}

export function update(iframe) {
    iframesMap.set(iframe, new IFrameManager(iframe));
}

export function show(iframe) {
    const iframeManager = iframesMap.get(iframe);
    if (!iframeManager) return;
    iframeManager.onVisible();
}

export function hide(iframe) {
    const iframeManager = iframesMap.get(iframe);
    if (!iframeManager) return;
    iframeManager.onHidden();
}

export function stop(iframe) {
    const iframeManager = iframesMap.get(iframe);
    if (!iframeManager) return;
    iframeManager.stopAnimateRequest();
}

export function start(iframe) {
    const iframeManager = iframesMap.get(iframe);
    if (!iframeManager) return;
    iframeManager.startAnimateRequest();
}

export function has(iframe) {
    const iframeManager = iframesMap.get(iframe);
    if (!iframeManager) return false;
    return true;
}
