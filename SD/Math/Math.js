function ddcmp(x) {
    if (Math.abs(x) > 1e-2) return 1;
    return Math.abs(x) < -1e-2 ? -1 : 0;
}

function dcmp(x) {
    if (Math.abs(x) > 1) return 1;
    return Math.abs(x) < -1 ? -1 : 0;
}

export function equal(x, y) {
    if (typeof(x) !== "number" || typeof(y) !== "number") return false;
    return dcmp(x - y) === 0;
}

export function dqual(x, y) {
    if (typeof(x) !== "number" || typeof(y) !== "number") return false;
    return ddcmp(x - y) === 0;
}

export function mapTo(left, length, newLeft, newLength) {
    return function(k) {
        if (length === 0) {
            return newLeft;
        }
        return newLeft + (k - left) / length * newLength;
    }
}
