export type URLString = `url(${string})`;

export class SDString {
    static isURL(url: string): url is URLString {
        return url.startsWith("url(") && url.endsWith(")");
    }

    static toString(url: string | URLString): string {
        if (url === undefined) return undefined;
        if (this.isURL(url)) return url.slice(4, -1);
        return url;
    }

    static toURLString(url: string): URLString {
        if (url === undefined) return undefined;
        if (this.isURL(url)) return url as URLString;
        return `url(${url})` as URLString;
    }
}
