import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/SVG/Line";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { hierarchy, stratify, tree } from "d3";

// javascript-obfuscator:disable
export function Tree(parent) {
    BaseTree.call(this, parent);

    this.type("Tree");
    this.newLayer("links");
    this.newLayer("nodes");

    this._.nodeType = Vertex;
    this._.linkType = Line;

    this.vars.merge({
        r: 20,
        width: 300,
        height: 0,
        layerHeight: 60,
    });

    this.effect("tree", () => {
        const x = this.x();
        const y = this.y();
        const position = node => {
            return [node.x + x, node.y + y];
        };
        D3Layout.call(this, "vertical", position);
    });
}

Tree.prototype = {
    ...BaseTree.prototype,
    width: Factory.handlerLowPrecise("width"),
    layerHeight: Factory.handlerLowPrecise("layerHeight"),
    height(height) {
        if (height === undefined) return this.vars.height;
        const depth = this.depth();
        if (!depth) return this;
        this.layerHeight(height / depth);
        return this;
    },
    newNode(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newNodeFromExistValue(id, value) {
        const element = new this._.nodeType(this.layer("nodes"));
        element.onEnter(EN.appear("nodes"));
        this.__insertNode(id, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    newNodeFromExistElement(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newLink(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links"));
        element.value(value);
        element.onEnter(EN.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
    newLinkFromExistValue(sourceId, targetId, value) {
        const element = new this._.linkType(this.layer("links"));
        element.onEnter(EN.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        element.value(value.onEnter(EN.moveTo()));
        return this;
    },
    newLinkFromExistElement(sourceId, targetId, value) {
        const element = value;
        element.onEnter(EN.moveTo("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
};

export function D3Layout(mode, convert, size) {
    let data, root, layout, result;
    try {
        const template = stratify();
        template.id(d => this.nodeId(d));
        template.parentId(d => {
            const father = this.father(d);
            return father ? this.nodeId(father) : undefined;
        });
        data = template(this.vars.nodes);
        root = hierarchy(data);
        if (mode === "vertical") {
            this.vars.height = root.height * this.layerHeight();
            layout = tree().size([this.width(), this.height()]);
        } else {
            this.vars.width = root.height * this.layerWidth();
            layout = tree().size([this.height(), this.width()]);
        }
        result = layout(root);
        const nodes = result.descendants();
        const nodesMap = new Map();
        nodes.forEach(node => {
            nodesMap.set(node.data.data, node);
        });
        this.forEachNode(node => {
            const layout = nodesMap.get(node);
            this.tryUpdate(node, () => {
                if (size) size(node);
                node.center(convert(layout));
            });
        });
        this.forEachLink((link, sourceId, targetId) => {
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            this.tryUpdate(link, () => {
                link.source(source.center());
                link.target(target.center());
                trim(link, source, target);
            });
        });
    } catch (err) {
        // this.forEachNode(node => {
        //     if (node._.first) {
        //         if (size) size(node);
        //         node.center(this.center());
        //         node._.first = undefined;
        //     }
        // });
        return;
    }
}
