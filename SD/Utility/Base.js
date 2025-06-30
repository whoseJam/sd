import { FIRST_INTER_STAGE, LAST_INTER_STAGE, LAST_MAIN_STAGE, pause } from "@/Animate/Window";

let initFinished = true;

export async function init(callback) {
    initFinished = false;
    const fn = async () => {
        if (window.self === window.top || (window.self !== window.top && window.IFRAME_INITED)) {
            await callback(window.IFRAME_ARGS ? window.IFRAME_ARGS : {});
            initFinished = true;
        } else {
            setTimeout(fn, 20);
        }
    };
    setTimeout(fn, 20);
}

export async function main(callback) {
    const fn = async () => {
        if (initFinished) {
            await callback();
            await pause(LAST_MAIN_STAGE);
        } else {
            setTimeout(fn, 20);
        }
    };
    setTimeout(fn, 20);
}

export async function inter(callback) {
    await pause(FIRST_INTER_STAGE);
    await callback();
    await pause(LAST_INTER_STAGE);
}
