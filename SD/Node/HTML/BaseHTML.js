import { SDNode } from "@/Node/SDNode";
import React from "react";

global.React = React;

export function BaseHTML(parent) {
    SDNode.call(this, parent, undefined, "div");

    this._.layer.setAttribute("position", "absolute");
    this._.layer.setAttribute("left", 0);
    this._.layer.setAttribute("top", 0);

    this._.BASE_HTML = true;
}

BaseHTML.prototype = {
    ...SDNode.prototype,
};
