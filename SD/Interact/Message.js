import { Animate as A } from "@/Animate/Animate";
import { Root } from "@/Interact/Root";

export class Message {
    static init() {
        window.Message = function (key, value) {
            window[key] = value;
        };

        window.Flush = function (id, url, rate, pdf, maxFrame = Infinity) {
            window.SHOULD_FLUSH = true;
            window.SHOULD_EXPORT = pdf;
            window.IFRAME_ID = id;
            window.IFRAME_URL = url;
            window.IFRAME_RATE = rate;
            window.IFRAME_MAX_FRAME = maxFrame;
        };

        window.SetViewBox = function (x, y, width, height, rate) {
            Root.setViewBox(x, y, width, height, rate);
        };

        window.StopAnimate = function () {
            A.stop();
        };

        window.StartAnimate = function () {
            A.start();
        };

        window.Reload = function () {
            window.location.reload();
        };

        window.OnInited = function () {
            window.parent.postMessage("inited", "*");
        };

        window.addEventListener("message", event => {
            const data = event.data;
            if (data.operator && data.arguments) {
                window[data.operator].apply(window, data.arguments);
            }
        });

        window.parent.postMessage("inited", "*");
    }

    static notifyParent() {
        window.parent.postMessage(
            {
                operator: "SetAnimationSize",
                arguments: [window.IFRAME_ID, window.IFRAME_URL, window.SVG_MINX, window.SVG_MINY, window.SVG_MAXX - window.SVG_MINX, window.SVG_MAXY - window.SVG_MINY],
            },
            "*"
        );
    }
}
