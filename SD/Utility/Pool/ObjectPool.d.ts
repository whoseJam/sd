import { Pool } from "@/Utility/Pool/Pool";

interface ObjectPoolParams {
    onIdle: (resource: any) => void;
    getIdle: (resource: any) => any;
    getUsed: (resource: any) => any;
    onCreate: (key: number | string) => any;
}

export class ObjectPool extends Pool {
    constructor(args: ObjectPoolParams);
    allocate(key: number | string): any;
    isUsing(key: number | string): boolean;
    get(key: number | string): any | undefined;
}
