import { Window } from "@/Animate/Window";
import { Device as D } from "@/Interact/Device";
import { Dom } from "@/Utility/Dom";

function reload(): void {
  if (window.parent) {
    window.parent.postMessage({
      operator: "ResetAnimationSize",
      arguments: [Window.IFRAME_ID, Window.IFRAME_URL],
    });
  }
  window.location.reload();
}

const RELOAD_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
</svg>
`;

const LEFT_ARROW_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
</svg>
`;

const RIGHT_ARROW_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
</svg>
`;

const DESCRIPTION_ICON = `
<svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2z" fill="currentColor"/>
</svg>
`;

export class Status {
  static status: HTMLElement;
  static description: HTMLElement;

  static init(): void {
    const element = Dom.createElementAndAppendToBody("div");
    element.innerHTML = `
        <div id="buttons" style="position: fixed; left: 10px; top: 10px; width: 100px; height: 20px; display: flex; opacity: 1;">
            <div style="width: 20px; height: 20px;">
                <div id="status" style="width: 10px; height: 10px; border-radius: 50%; background-color: green; translate: 5px 5px;"></div>
            </div>
            <div style="width: 20px; height: 20px; margin-left:" id="reload">${RELOAD_ICON}</div>
            <div style="width: 20px; height: 20px;" id="prev">${LEFT_ARROW_ICON}</div>
            <div style="width: 20px; height: 20px;" id="next">${RIGHT_ARROW_ICON}</div>
            <div style="width: 20px; height: 20px; position: relative; cursor: pointer;" id="detail">
                ${DESCRIPTION_ICON}
                <div id="description" style="display: none; position: absolute; left: 25px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 8px 12px; border-radius: 4px; white-space: nowrap; font-size: 12px; z-index: 1000;">暂无简介</div>
            </div>
        </div>
        `;

    Status.status = Dom.getHTMLByID("status");
    Dom.addEventListener(Dom.getByID("reload"), "click", () => reload());
    Dom.addEventListener(Dom.getByID("prev"), "click", () => D.keyDown("P"));
    Dom.addEventListener(Dom.getByID("next"), "click", () => D.keyDown("N"));

    const detail = Dom.getHTMLByID("detail");
    this.description = Dom.getHTMLByID("description");
    Dom.addEventListener(detail, "mouseenter", () => {
      this.description.style.display = "block";
    });
    Dom.addEventListener(detail, "mouseleave", () => {
      this.description.style.display = "none";
    });

    D.onKeyDown("tT", () => {
      const buttons = Dom.getHTMLByID("buttons");
      const opacity = +buttons.style["opacity"];
      buttons.style["opacity"] = String(opacity ^ 1);
    });
  }

  static updateFrameStatus(): void {
    Status.status.style["backgroundColor"] = this.isInteractable()
      ? "green"
      : "red";
  }

  static isInteractable(): boolean {
    if (Window.IS_CONTINUING) return false;
    if (Window.IS_INTERACTING) return false;
    if (Window.MAXIMUM_FRAME !== Window.CURRENT_FRAME) return false;
    return true;
  }

  static setDescription(description: string) {
    this.description.innerHTML = description;
  }
}
