import { Text } from "@/Node/Nake/Text";
import { Mathjax } from "@/Node/Text/Mathjax";
import { Factory } from "@/Utility/Factory";

function isMathjax(str) {
    const label = String(str).trim();
    return label.startsWith("$") && label.endsWith("$") && label.length >= 2;
}

function labelRule(parent, child) {
    const location = child.vars.location;
    const gap = child.vars.labelGap;
    if (location === "lt") child.mx(parent.x() - gap).y(parent.y());
    else if (location === "lc") child.mx(parent.x() - gap).cy(parent.cy());
    else if (location === "lb") child.mx(parent.x() - gap).my(parent.my());
    else if (location === "tl") child.my(parent.y() - gap).x(parent.x());
    else if (location === "tc") child.my(parent.y() - gap).cx(parent.cx());
    else if (location === "tr") child.my(parent.y() - gap).mx(parent.mx());
    else if (location === "bl") child.y(parent.my() + gap).x(parent.x());
    else if (location === "bc") child.y(parent.my() + gap).cx(parent.cx());
    else if (location === "br") child.y(parent.my() + gap).mx(parent.mx());
    else if (location === "rt") child.x(parent.mx() + gap).y(parent.y());
    else if (location === "rc") child.x(parent.mx() + gap).cy(parent.cy());
    else if (location === "rb") child.x(parent.mx() + gap).my(parent.my());
}

export function Label(parent, text, location = "lc", fontSize = 20, gap = 10) {
    let label = undefined;
    if (typeof text === "string" || typeof text === "number") {
        if (isMathjax(text)) label = new Mathjax(parent, text);
        else label = new Text(parent, text);
    } else label = text;

    label.fontSize(fontSize);
    label.vars.merge({
        location: location,
        labelGap: gap,
    });
    label.location = Factory.handler("location");
    label.gap = Factory.handlerLowPrecise("labelGap");

    parent.childAs(label, labelRule);

    return label;
}

export function MathjaxLabel(parent, text, location = "lc", fontSize = 20, gap = 10) {
    return Label(parent, new Mathjax(parent, text), location, fontSize, gap);
}
