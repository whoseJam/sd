import { Enter as EN } from "@/Node/Core/Enter";
import { Vertex } from "@/Node/Element/Vertex";
import { LineSVG } from "@/Node/SVG/Path/LineSVG";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Cast } from "@/Utility/Cast";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { hierarchy, stratify, tree } from "d3";

export function Tree(parent) {
    BaseTree.call(this, parent);

    this.type("Tree");
    this.newLayer("links");
    this.newLayer("nodes");

    this._.nodeType = Vertex;
    this._.linkType = LineSVG;

    this.vars.merge({
        r: 20,
        width: 300,
        height: 0,
        layout: "vertical",
        layerGap: 60,
    });

    this.effect("tree", () => {
        const mode = this.layout();
        let data, root, layout, result, convert;
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
                this.vars.height = root.height * this.layerGap();
                layout = tree().size([this.width(), this.height()]);
                convert = node => [this.x() + node.x, this.y() + node.y];
            } else {
                this.vars.width = root.height * this.layerGap();
                layout = tree().size([this.height(), this.width()]);
                convert = node => [this.x() + node.y, this.y() + node.x];
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
        } catch (error) {
            if (error.message === "no root" || error.message === "multiple roots") {
                this.forEachNode(node => {
                    if (this.inRange(node.center())) return;
                    this.tryUpdate(node, () => {
                        node.center(this.x(), this.y());
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
            } else ErrorLauncher.whatHappened();
        }
    });
}

Tree.prototype = {
    ...BaseTree.prototype,
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        if (this.layout() === "horizontal") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerWidth(width);
            return this.layerWidth(width / depth);
        } else {
            this.vars.width = width;
            return this;
        }
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        if (this.layout() === "vertical") {
            const depth = this.depth() - 1;
            if (!depth) return this.layerHeight(height);
            return this.layerHeight(height / depth);
        } else {
            this.vars.height = height;
            return this;
        }
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
    newLinkFromExistElement(sourceId, targetId, element) {
        element.onEnter(EN.moveTo("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
    layout(layout) {
        if (arguments.length === 0) return this.vars.layout;
        if (this.vars.layout !== layout) {
            this.vars.setTogether({
                layout,
                width: this.vars.height,
                height: this.vars.width,
            });
            return this;
        }
        return this;
    },
    layerGap: Factory.handlerLowPrecise("layerGap"),
    layerWidth: Factory.handlerLowPrecise("layerGap"),
    layerHeight: Factory.handlerLowPrecise("layerGap"),
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
