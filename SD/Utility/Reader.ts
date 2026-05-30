type ReaderFunction<T> = (word: string, pos: number) => [T, number];

class Reader {
    static readCharArray = readArray(readChar);
    static readCharMatrix = readMatrix(readChar);
    static readIntArray = readArray(readInt);
    static readIntMatrix = readMatrix(readInt);
    static readDoubleArray = readArray(readDouble);
    static readDoubleMatrix = readMatrix(readDouble);
}

export function input(): typeof Reader {
    return Reader;
}

function readChar(word: string, pos: number): [string, number] {
    while (pos < word.length && /\s/.test(word[pos])) pos++;
    return pos >= word.length ? ["", pos] : [word[pos], pos + 1];
}

function readInt(word: string, pos: number): [number, number] {
    let ans = 0;
    let flg = 1;
    while (pos < word.length && !/\d/.test(word[pos])) {
        if (word[pos] === "-") flg = -1;
        pos++;
    }
    if (pos >= word.length) return [0, pos];
    while (pos < word.length && /\d/.test(word[pos])) ans = ans * 10 + +word[pos++];
    return [ans * flg, pos];
}

function readDouble(word: string, pos: number): [number, number] {
    let ans = "";
    let flg = 1;
    while (pos < word.length && !/\d/.test(word[pos])) {
        if (word[pos] === "-") flg = -1;
        pos++;
    }
    if (pos >= word.length) return [0, pos];
    while (pos < word.length && /\d/.test(word[pos])) ans += word[pos++];
    if (pos < word.length && word[pos] === ".") {
        ans += word[pos++];
        while (pos < word.length && /\d/.test(word[pos])) ans += word[pos++];
    }
    return [+ans * flg, pos];
}

function readArray<T>(reader: ReaderFunction<T>) {
    return (word: string, n: number, padding = true): Array<T | 0> => {
        const ans: Array<T | 0> = padding ? [0] : [];
        let pos = 0;
        for (let i = 1; i <= n; i++) {
            const [val, newPos] = reader(word, pos);
            ans.push(val);
            pos = newPos;
        }
        return ans;
    };
}

function readMatrix<T>(reader: ReaderFunction<T>) {
    return (word: string, n: number, m: number, padding = true): Array<Array<T | 0> | 0> => {
        const ans: Array<Array<T | 0> | 0> = padding ? [0] : [];
        let pos = 0;
        for (let i = 1; i <= n; i++) {
            const row: Array<T | 0> = padding ? [0] : [];
            for (let j = 1; j <= m; j++) {
                const [val, newPos] = reader(word, pos);
                row.push(val);
                pos = newPos;
            }
            ans.push(row);
        }
        return ans;
    };
}
