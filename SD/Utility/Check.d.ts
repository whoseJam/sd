export class Check {
    static isFalse(object: any): boolean;
    static isEmpty(object: any): boolean;
    static isString(object: any): boolean;
    static isOpacity(object: any): boolean;
    static isNumber(object: any): boolean;
    static isNumberOrString(object: any): boolean;
    static isVector(object: any): boolean;
    static isColor(object: any): boolean;
    static isSDColor(object: any): boolean;
    static isHexColor(object: any): boolean;
    static isAsyncFucntion(object: any): boolean;
    static isSyncFunction(object: any): boolean;

    static validateOpacity(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateNumber(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateNumberOrString(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateColor(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateSDColor(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateHexColor(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateSyncFunction(object: any, method: string, i?: number, suggestions: Array<[(object: any) => boolean, string]>): void;
    static validateArgumentsCountEqualTo(arguments: Array<any>, count: number, method: string): void;
}
