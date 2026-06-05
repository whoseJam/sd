export function linkTo(link, color) {
    const clazz = link.constructor;
    const clone = new clazz(link);
    clone.freeze();
    clone.source(link.source());
    clone.target(link.target());
    clone.unfreeze();
    clone.color(color).strokeWidth(2.5);
    clone.startAnimate();
    if (!link.reversed) clone.pointStoT();
    else clone.pointTtoS();
    clone.endAnimate();
    if (link.markerEnd()) clone.arrow();
    return clone;
}

export function linkToWithArrow(link, color) {
    const clazz = link.constructor;
    const clone = new clazz(link);
    clone.freeze();
    clone.source(link.source());
    clone.target(link.target());
    clone.unfreeze();
    clone.color(color).strokeWidth(2.5);
    clone.startAnimate();
    if (!link.reversed) clone.pointStoT();
    else clone.pointTtoS();
    clone.endAnimate();
    if (!link.reversed) clone.arrow();
    else clone.revArrow();
    return clone;
}
