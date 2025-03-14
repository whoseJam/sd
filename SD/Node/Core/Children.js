import { Exit as EX } from "@/Node/Core/Exit";

let id = 0;

export class Children {
    constructor(parent) {
        this.parent = parent;
        this.children = {};
    }
    child(name) {
        return this.children[name];
    }
    forEach(callback) {
        for (let id in this.children) callback(this.children[id], id);
    }
    push(name, child, rule) {
        if (typeof name !== "string" && typeof name !== "number") {
            name = ++id;
            child = arguments[0];
            rule = arguments[1] ? arguments[1] : undefined;
        }
        child._.parent = this.parent;
        this.children[name] = child;
        child.rule(rule);
        return name;
    }
    erase(child) {
        let name = child;
        if (typeof child !== "string" && typeof child !== "number") {
            for (let id in this.children)
                if (this.children[id] === child) {
                    name = id;
                    break;
                }
        }
        child = this.children[name];
        if (child === undefined) return undefined;
        if (!child.onExit()) child.onExit(EX.fade());
        child.triggerExit();
        if (child.rule()) child.eraseRule();
        child._.parent = undefined;
        delete this.children[name];
        return child;
    }
    has(child) {
        let name = child;
        if (typeof child !== "string" && typeof child !== "number") {
            for (let id in this.children)
                if (this.children[id] === child) {
                    name = id;
                    break;
                }
        }
        if (this.children[name]) return true;
        return false;
    }
}
