import { BaseShape } from "@/Node/Shape/BaseShape";

export class Image extends BaseShape {
    href(): string;
    href(href: string): this;
}
