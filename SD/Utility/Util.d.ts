export function int(x: any): number;

export function make1d(length: number): Array<number>;
export function make1d(length: number, defaultValue: any): Array<any>;

export function make2d(rows: number, columns: number): Array<Array<number>>;
export function make2d(rows: number, columns: number, defaultValue: any): Array<any>;

export function init(callback: any): void;
export function main(callback: any): void;
export function inter(callback: any): void;

export function reversible(): void;
export function irreversible(): void;
