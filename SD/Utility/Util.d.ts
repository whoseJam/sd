export function make1d(length: number): Array<number>;
export function make1d(length: number, defaultValue: any): Array<any>;

export function make2d(rows: number, columns: number): Array<Array<number>>;
export function make2d(rows: number, columns: number, defaultValue: any): Array<any>;

export function reversible(): void;
export function irreversible(): void;
