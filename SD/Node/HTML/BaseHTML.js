import { SD2DNode } from "@/Node/SD2DNode";
import React from "react";

global.React = React;

export function BaseHTML(parent) {
    SD2DNode.call(this, parent, undefined, "div");

    this._.layer.setAttribute("position", "absolute");
    this._.layer.setAttribute("left", 0);
    this._.layer.setAttribute("top", 0);

    this._.BASE_HTML = true;
}

BaseHTML.prototype = {
    ...SD2DNode.prototype,
    BASE_HTML: true,
};
