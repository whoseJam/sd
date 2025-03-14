export class CompStress {
    stress(): this;
    stress(rate: number): this;
}

export function Stress<T>(parent: T): CompStress & T;
