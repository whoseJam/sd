export function centerOnly() {
    return function (parent, child) {
        const cx = parent.cx();
        const cy = parent.cy();
        child.cx(cx).cy(cy);
    };
}

export function centerFixAspect(rate = 1.2) {
    return function (parent, child) {
        const cx = parent.cx();
        const cy = parent.cy();
        const w = parent.width();
        const h = parent.height();
        const cw = Math.max(child.width(), 1);
        const ch = Math.max(child.height(), 1);
        const kw = w / cw / rate;
        const kh = h / ch / rate;
        const k = Math.min(kw, kh);
        child.width(cw * k);
        child.height(ch * k);
        child.cx(cx).cy(cy);
    };
}

export function center(rate = 1.2) {
    return function (parent, child) {
        const cx = parent.cx();
        const cy = parent.cy();
        const w = parent.width();
        const h = parent.height();
        const cw = w / rate;
        const ch = h / rate;
        child.width(cw).height(ch);
        child.cx(cx).cy(cy);
    };
}

export function triangleCenterFixAspect(rate = 1.2) {
    return function (parent, child) {
        let width = parent.width();
        let height = parent.height();
        let cwidth = child.width();
        let cheight = child.height();
        if (cwidth === 0 || cheight === 0) {
            child.width(width / rate);
            child.height(height / rate);
            cwidth = child.width();
            cheight = child.height();
        }
        let k = cheight / cwidth;
        let x = height / (height / width + cheight / cwidth);
        child.width(x).height(k * x);
        let H = (parent.height() * child.width()) / parent.width();
        let y = parent.my() - H / 2;
        child.cx(parent.cx());
        child.my(parent.my());
    };
}
