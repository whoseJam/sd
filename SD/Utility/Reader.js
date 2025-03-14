class Reader {
    static readCharArray = readArray(readChar);
    static readCharArray = readArray(readChar);
    static readCharMatrix = readMatrix(readChar);
    static readIntArray = readArray(readInt);
    static readIntMatrix = readMatrix(readInt);
    static readDoubleArray = readArray(readDouble);
    static readDoubleMatrix = readMatrix(readDouble);
}

export function input() {
    return Reader;
}

function readChar(word, pos) {
    while (pos < word.length && (word[pos] === " " || word[pos] === "\n")) pos++;
    if (pos >= word.length) return ["", pos];
    let ans = word[pos++];
    return [ans, pos];
}

function readInt(word, pos) {
    let ans = 0,
        flg = 1;
    while (pos < word.length && (word[pos] < "0" || word[pos] > "9")) {
        if (word[pos] === "-") flg = -1;
        pos++;
    }
    if (pos >= word.length) return [0, pos];
    while (pos < word.length && "0" <= word[pos] && word[pos] <= "9") {
        ans = ans + word[pos];
        pos++;
    }
    return [+ans * flg, pos];
}

function readDouble(word, pos) {
    let ans = "",
        flg = 1;
    while (pos < word.length && (word[pos] < "0" || word[pos] > "9")) {
        if (word[pos] === "-") flg = -1;
        pos++;
    }
    if (pos >= word.length) return [0, pos];
    while (pos < word.length && "0" <= word[pos] && word[pos] <= "9") {
        ans = ans + word[pos];
        pos++;
    }
    if (pos < word.length && word[pos] === ".") {
        ans = ans + word[pos];
        pos++;
        while (pos < word.length && "0" <= word[pos] && word[pos] <= "9") {
            ans = ans + word[pos];
            pos++;
        }
    }
    return [+ans * flg, pos];
}

function readArray(reader) {
    return function (word, n, padding = true) {
        let ans = [],
            pos = 0;
        if (padding) ans.push(0);
        for (let i = 1; i <= n; i++) {
            let result = reader(word, pos);
            ans.push(result[0]);
            pos = result[1];
        }
        return ans;
    };
}

function readMatrix(reader) {
    return function (word, n, m, padding = true) {
        let ans = [],
            pos = 0;
        if (padding) ans.push(0);
        for (let i = 1; i <= n; i++) {
            let row = [];
            if (padding) row.push(0);
            for (let j = 1; j <= m; j++) {
                let result = reader(word, pos);
                row.push(result[0]);
                pos = result[1];
            }
            ans.push(row);
        }
        return ans;
    };
}
