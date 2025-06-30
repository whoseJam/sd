import { Dom } from "@/Dom/Dom";
import { Device as D } from "@/Interact/Device";

function reload() {
    window.parent.ResetAnimationSize(window.IFRAME_ID, window.IFRAME_URL);
    window.location.reload();
}

export class Status {
    static init() {
        const element = Dom.createElementAndAppendToBody("div");
        element.innerHTML = `
        <div id="wrapper" style="position: fixed; left: 10px; top: 10px; width: 60px; height: 20px; display: flex; opacity: 1;">
            <div style="width: 20px; height: 20px;">
                <div id="frameStatus" style="width: 10px; height: 10px; border-radius: 50%; background-color: green; translate: 5px 5px;"></div>
            </div>
            <div style="width: 20px; height: 20px;">
                <i id="syncIcon" class="sync icon"></i>
            </div>
        </div>
        `;

        Status.frameStatus = Dom.getByID("frameStatus");
        const syncIcon = Dom.getByID("syncIcon");
        Dom.addEventListener(syncIcon, "click", () => {
            reload();
        });

        const wrapper = Dom.getByID("wrapper");
        D.onKeyDown("t", () => {
            wrapper.style["opacity"] ^= 1;
        });
    }

    static updateFrameStatus() {
        Status.frameStatus.style["backgroundColor"] = this.isInteractable() ? "green" : "red";
    }

    static isInteractable() {
        if (window.IS_CONTINUING) return false;
        if (window.IS_INTERACTING) return false;
        if (window.MAXIMUM_FRAME !== window.CURRENT_FRAME) return false;
        return true;
    }
}
