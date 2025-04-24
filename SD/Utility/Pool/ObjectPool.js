import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Pool } from "@/Utility/Pool/Pool";

export class ObjectPool extends Pool {
    constructor(args) {
        super(args);
        this.resources = {};
    }
    beforeAllocate() {
        for (const key in this.resources) {
            const resource = this.resources[key];
            if (resource.__pool_status === "using") {
                resource.__pool_status = "used";
            }
        }
    }
    allocate(key) {
        const resource = this.resources[key];
        if (!resource) {
            const resource = this.onCreate(key);
            this.resources[key] = resource;
            resource.__pool_status = "using";
            return this.getIdle(resource);
        }
        if (resource.__pool_status === "using") ErrorLauncher.whatHappened();
        if (resource.__pool_status === "used") {
            resource.__pool_status = "using";
            return this.getUsed(resource);
        } else {
            resource.__pool_status = "using";
            return this.getIdle(resource);
        }
    }
    afterAllocate() {
        for (const key in this.resources) {
            const resource = this.resources[key];
            if (resource.__pool_status === "used") {
                resource.__pool_status = "idle";
                this.onIdle(resource);
            }
        }
    }
    isUsing(key) {
        const resource = this.resources[key];
        return resource && resource.__pool_status === "using";
    }
    get(key) {
        const resource = this.resources[key];
        return resource;
    }
}
