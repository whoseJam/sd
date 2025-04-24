import { Pool } from "./Pool";

export class ArrayPool extends Pool {
    constructor(args) {
        super(args);
        this.resources = [];
    }
    beforeAllocate() {
        for (const resource of this.resources) if (resource.__pool_status === "using") resource.__pool_status = "used";
    }
    allocate() {
        for (let i = 0; i < this.resources.length; i++) {
            const resource = this.resources[i];
            if (resource.__pool_status === "using") continue;
            if (resource.__pool_status === "used") {
                resource.__pool_status = "using";
                return this.getUsed(resource);
            } else {
                resource.__pool_status = "using";
                return this.getIdle(resource);
            }
        }
        const resource = this.onCreate();
        this.resources.push(resource);
        resource.__pool_status = "using";
        return this.getIdle(resource);
    }
    afterAllocate() {
        for (const resource of this.resources) {
            if (resource.__pool_status === "used") {
                resource.__pool_status = "idle";
                this.onIdle(resource);
            }
        }
    }
}
