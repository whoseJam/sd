import { Action } from "@/Animate/Action";

export class ActionList {
    constructor();
    push(action: Action): void;
    pushWithoutTrim(action: Action): void;
    checkConflict(before: Action, after: Action): void;
    trim(action: Action): void;
    flushHidden(): void;
    filter(condition: (action: Action) => boolean): void;
    tick(t: number, dt: number): void;
    restart(t: number): void;
    forceToFinish(): void;
    finished(): boolean;
    rollback(): ActionList;
    replay(): ActionList;
}
