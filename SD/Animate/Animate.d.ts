import { Action } from "@/Animate/Action";

export class Animate {
    static start();
    static stop();
    static tick(t: number);
    static finished(): boolean;
    static forceToFinish();
    static push(action: Action);
    static startNewFrame();
    static rollbackFrame();
    static replayFrame();
    static debug();
}
