export class Action {
    static stopFlag = 1 << 0;
    static hideFlag = 1 << 1;
    static firstCallFlag = 1 << 2;
    constructor(other: Action);
    constructor(l: number, r: number, source: any, target: any, callback: (t: number) => void, owner: any, channel: string);
    is(flag: number): void;
    set(flag: number): void;
    unset(flag: number): void;
    tick(t: number): void;
    forceToFinish(): void;
    toString(): string;
    ownerIsReady(): boolean;
    ownerIsCreated(): boolean;
    clone(): Action;
}
