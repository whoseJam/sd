export class Factory {
    static handler(key: string);
    static handlerLowPrecise(key: string);
    static handlerMediumPrecise(key: string);
    static handlerHighPrecise(key: string);

    static action(node: SDNode, attr: RenderNode, key: string, interp);
}