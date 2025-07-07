class Reader {
    static readCharArray(input: string, n: number, padding?: boolean): Array<string>;
    static readCharMatrix(input: string, n: number, m: number, padding?: boolean): Array<Array<string>>;
    static readIntArray(input: string, n: number, padding?: boolean): Array<number>;
    static readIntMatrix(input: string, n: number, m: number, padding?: boolean): Array<Array<number>>;
    static readDoubleMatrix(input: string, n: number, padding?: boolean): Array<number>;
    static readDoubleArray(input: string, n: number, m: number, padding?: boolean): Array<Array<number>>;
}

export function input(): typeof Reader;
