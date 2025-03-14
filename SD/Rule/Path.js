export function pointAtPathByRate(k, xLocator = "cx", yLocator = "cy", xGap = 0, yGap = 0) {
    return function (parent, child) {
        const point = parent.at(k);
        child[xLocator](point[0] + xGap);
        child[yLocator](point[1] + yGap);
    };
}

export function pointAtPathByLength(length, xLocator = "x", yLocator = "y", xGap = 0, yGap = 0) {
    return function (parent, child) {
        const point = parent.getPointAtLength(length);
        child[xLocator](point[0] + xGap);
        child[yLocator](point[1] + yGap);
    };
}
