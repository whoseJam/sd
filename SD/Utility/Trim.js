function trimSource(link, source) {
    if (!source) return 0;
    let l = 0,
        r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (source.inRange(link.at(mid))) l = mid;
        else r = mid;
    }
    if (l < 1e-2) return 0;
    return l;
}

function trimTarget(link, target) {
    if (!target) return 1;
    let l = 0,
        r = 1;
    while (r - l > 1e-3) {
        const mid = (l + r) / 2.0;
        if (target.inRange(link.at(mid))) r = mid;
        else l = mid;
    }
    if (l > 1 - 1e-2) return 1;
    return l;
}

export function trim(link, source, target) {
    const s = trimSource(link, source);
    const t = trimTarget(link, target);
    const ls = link.at(s);
    const lt = link.at(t);
    if (global.debug) {
        console.log("trim s=", s, "trim t=", t, ls, lt, "this=", link);
        console.log("trim info=", source.x(), source.mx(), source.y(), source.my(), source.inRange(ls));
    }
    link.freeze();
    link.source(ls);
    link.target(lt);
    link.unfreeze();
    if (global.debug) {
        console.log("after set source&target, the source is ", link.source(), ls);
        console.log("-------------------");
    }
}
