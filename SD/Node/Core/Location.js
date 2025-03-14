export class Location {
    static scale(scale) {
        const width = this.width();
        const height = this.height();
        this.freeze();
        this.width(width * scale);
        this.height(height * scale);
        this.unfreeze();
        return this;
    }
    static position(xLocator, yLocator, dx = 0, dy = 0) {
        return [this[xLocator]() + dx, this[yLocator]() + dy];
    }
    static center(cx, cy) {
        if (cx === undefined) {
            return [this.cx(), this.cy()];
        } else if (arguments.length === 1) {
            return this.center(cx[0], cx[1]);
        }
        this.freeze();
        this.cx(cx).cy(cy);
        this.unfreeze();
        return this;
    }
    static kQuantileLocation(locator, size) {
        return function (k) {
            return this[locator]() + k * this[size]();
        };
    }
    static centerLocation(locator, size) {
        return function (x) {
            if (x === undefined) {
                return this[locator]() + this[size]() / 2;
            }
            this[locator](x - this[size]() / 2);
            return this;
        };
    }
    static maxiumLocation(locator, size) {
        return function (mx) {
            if (mx === undefined) {
                return this[locator]() + this[size]();
            }
            this[locator](mx - this[size]());
            return this;
        };
    }
    static moveLocation(locator) {
        return function (d) {
            this[locator](this[locator]() + d);
            return this;
        };
    }
}
