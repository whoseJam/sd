import * as sd from "@/sd";

/**
 * @param {string} str 一个带有前缀空格的字符串
 * @returns {Array<number>}
 */
export function buildLenSync(str) {
    const n = str.length - 1;
    const len = sd.make1d(n + 5);
    let j = 0;
    for (let i = 2; i <= n; i++) {
        while (str[j + 1] !== str[i] && j) {
            j = len[j];
        }
        if (str[j + 1] === str[i]) j++;
        len[i] = j;
    }
    return len;
}
