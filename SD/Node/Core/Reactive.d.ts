type Effect = () => void;
type Precise = (oldValue: any, newValue: any) => boolean;
export function reactive<T>(object: T): T & {
    associate(key: string, func: any);
};
export function freeze();
export function unfreeze();
export function setPrecise(proxy: any, key: string, checker: Precise);
export function effect(effect: Effect, tag: any);
export function uneffect(effect: Effect);
export function object(proxy: any): any;
export function checkEffect(effect: Effect);
