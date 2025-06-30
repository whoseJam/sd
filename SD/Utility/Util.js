export function make1d(length, defaultValue = 0) {
    const result = [];
    for (let i = 0; i < length; i++) {
        if (typeof defaultValue === "object") {
            result.push(Object.assign({}, defaultValue));
        } else result.push(defaultValue);
    }
    return result;
}

export function make2d(rows, columns, defaultValue = 0) {
    const result = [];
    for (let i = 0; i < rows; i++) {
        result.push(make1d(columns, defaultValue));
    }
    return result;
}

export function reversible() {
    global.ACTION_TICK++;
}

export function irreversible() {
    global.ACTION_TICK--;
}
