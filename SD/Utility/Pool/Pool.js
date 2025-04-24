export class Pool {
    constructor(args) {
        this.onIdle = args.onIdle;
        this.getIdle = args.getIdle;
        this.getUsed = args.getUsed;
        this.onCreate = args.onCreate;
    }
}
