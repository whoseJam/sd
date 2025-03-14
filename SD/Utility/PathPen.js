import { Check } from "@/Utility/Check";

export function PathPen() {
    this.result = "";
}

PathPen.prototype = {
    toString: function () {
        return this.result;
    },
    MoveTo: MoveToFunction("M", "MoveTo"),
    moveTo: MoveToFunction("m", "moveTo"),
    LinkTo: LinkToFunction("L", "LinkTo"),
    linkTo: LinkToFunction("l", "linkTo"),
    Cubic: CubicFunction("C", "Cubic"),
    cubic: CubicFunction("c", "cubic"),
    Quad: QuadFunction("Q", "Quad"),
    quad: QuadFunction("q", "quad"),
    Arc: ArcFunction("A", "Arc"),
    arc: ArcFunction("a", "arc"),
};

function checkNumberIsValid(label, x) {
    if (!Check.isValidNumber(x)) {
        throw new Error(`Number ${label} = ${x} Is Not Valid`);
    }
}

function MoveToFunction(spec, name) {
    return function (x, y) {
        if (arguments.length === 1) {
            return this[name](x[0], x[1]);
        }
        x = +x;
        y = +y;
        checkNumberIsValid("x", x);
        checkNumberIsValid("y", y);
        this.result += `${spec}${x.toFixed(0)},${y.toFixed(0)}`;
        return this;
    };
}

function LinkToFunction(spec, name) {
    return function (x, y) {
        if (arguments.length === 1) {
            return this[name](x[0], x[1]);
        }
        x = +x;
        y = +y;
        checkNumberIsValid("x", x);
        checkNumberIsValid("y", y);
        this.result += `${spec}${x.toFixed(0)},${y.toFixed(0)}`;
        return this;
    };
}

function CubicFunction(spec, name) {
    return function (x1, y1, x2, y2, x, y) {
        if (arguments.length === 3) {
            return this[name](x1[0], x1[1], y1[0], y1[1], x2[0], x2[1]);
        }
        x1 = +x1;
        x2 = +x2;
        x = +x;
        y1 = +y1;
        y2 = +y2;
        y = +y;
        checkNumberIsValid("x1", x1);
        checkNumberIsValid("y1", y1);
        checkNumberIsValid("x2", x2);
        checkNumberIsValid("y2", y2);
        checkNumberIsValid("x", x);
        checkNumberIsValid("y", y);
        this.result += `${spec}${x1.toFixed(0)},${y1.toFixed(0)},${x2.toFixed(0)},${y2.toFixed(0)},${x.toFixed(0)},${y.toFixed(0)}`;
        return this;
    };
}

function QuadFunction(spec, name) {
    return function (x1, y1, x, y) {
        if (arguments.length === 2) {
            return this[name](x1[0], x1[1], y1[0], y1[1]);
        }
        x1 = +x1;
        x = +x;
        y1 = +y1;
        y = +y;
        checkNumberIsValid("x1", x1);
        checkNumberIsValid("x", x);
        checkNumberIsValid("y1", y1);
        checkNumberIsValid("y", y);
        this.result += `${spec}${x1.toFixed(0)},${y1.toFixed(0)},${x.toFixed(0)},${y.toFixed(0)}`;
        return this;
    };
}

function ArcFunction(spec, name) {
    return function (rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
        if (rx && rx.length) {
            return this[name](rx[0], rx[1], ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
        }
        if (x && x.length) {
            return this[name](rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x[0], x[1]);
        }
        rx = +rx;
        ry = +ry;
        xAxisRotation = +xAxisRotation;
        largeArcFlag = +largeArcFlag;
        sweepFlag = +sweepFlag;
        x = +x;
        y = +y;
        checkNumberIsValid("rx", rx);
        checkNumberIsValid("rx", ry);
        checkNumberIsValid("xAxisRotation", xAxisRotation);
        checkNumberIsValid("largeArcFlag", largeArcFlag);
        checkNumberIsValid("sweepFlag", sweepFlag);
        checkNumberIsValid("x", x);
        checkNumberIsValid("y", y);
        if (largeArcFlag !== 0 && largeArcFlag !== 1) {
            throw new Error(`LargeArcFlag Must Be 0 or 1, But We Got ${largeArcFlag}`);
        }
        if (sweepFlag !== 0 && sweepFlag !== 1) {
            throw new Error(`SweepFlag Must Be 0 or 1, But We Got ${sweepFlag}`);
        }
        this.result += `${spec}${rx.toFixed(0)},${ry.toFixed(0)},${xAxisRotation.toFixed(0)},${largeArcFlag},${sweepFlag},${x.toFixed(0)},${y.toFixed(0)}`;
        return this;
    };
}
