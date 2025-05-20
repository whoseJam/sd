import { Pool } from "@/Utility/Pool/Pool";

interface ArrayPoolParams {
    onIdle: (resource: any) => void;
    getIdle: (resource: any) => any;
    getUsed: (resource: any) => any;
    onCreate: () => any;
}

export class ArrayPool extends Pool {
    constructor(args: ArrayPoolParams);
    allocate(): any;
}
