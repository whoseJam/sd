import { Check } from "@/Utility/Check";

/**
 * SVG Path Builder with fluent API
 *
 * Provides a chainable interface for constructing SVG path strings.
 * All methods return `this` to enable method chaining.
 *
 * Naming convention:
 * - Uppercase methods (MoveTo, LineTo, etc.) use absolute coordinates
 * - Lowercase methods (moveTo, lineTo, etc.) use relative coordinates
 *
 * @example
 * const path = new PathPen()
 *   .MoveTo(10, 10)
 *   .LineTo(100, 100)
 *   .Cubic(120, 80, 140, 120, 200, 100)
 *   .ClosePath()
 *   .toString();
 */
export class PathPen {
    private result = "";

    /** Convert the accumulated path commands to an SVG path string */
    toString(): string {
        return this.result;
    }

    /**
     * Move to absolute coordinates without drawing
     * @param v - Target position as [x, y] array
     * @returns this for method chaining
     */
    MoveTo(v: [number, number]): this;
    /**
     * Move to absolute coordinates without drawing
     * @param x - Target x coordinate
     * @param y - Target y coordinate
     * @returns this for method chaining
     */
    MoveTo(x: number, y: number): this;
    MoveTo(x: number | [number, number], y?: number): this {
        if (Array.isArray(x)) return this.MoveTo(x[0], x[1]);
        Check.validateNumber(+x, "PathPen.MoveTo", 1);
        Check.validateNumber(+y, "PathPen.MoveTo", 2);
        this.result += `M${(+x).toFixed(0)},${(+y).toFixed(0)}`;
        return this;
    }

    /**
     * Move by relative offset without drawing
     * @param dv - Relative offset as [dx, dy] array
     * @returns this for method chaining
     */
    moveTo(dv: [number, number]): this;
    /**
     * Move by relative offset without drawing
     * @param dx - X-axis offset from current position
     * @param dy - Y-axis offset from current position
     * @returns this for method chaining
     */
    moveTo(dx: number, dy: number): this;
    moveTo(dx: number | [number, number], dy?: number): this {
        if (Array.isArray(dx)) return this.moveTo(dx[0], dx[1]);
        Check.validateNumber(+dx, "PathPen.moveTo", 1);
        Check.validateNumber(+dy, "PathPen.moveTo", 2);
        this.result += `m${(+dx).toFixed(0)},${(+dy).toFixed(0)}`;
        return this;
    }

    /**
     * Draw a straight line to absolute coordinates
     * @param v - Target position as [x, y] array
     * @returns this for method chaining
     */
    LineTo(v: [number, number]): this;
    /**
     * Draw a straight line to absolute coordinates
     * @param x - Target x coordinate
     * @param y - Target y coordinate
     * @returns this for method chaining
     */
    LineTo(x: number, y: number): this;
    LineTo(x: number | [number, number], y?: number): this {
        if (Array.isArray(x)) return this.LineTo(x[0], x[1]);
        Check.validateNumber(+x, "PathPen.LineTo", 1);
        Check.validateNumber(+y, "PathPen.LineTo", 2);
        this.result += `L${(+x).toFixed(0)},${(+y).toFixed(0)}`;
        return this;
    }

    /**
     * Draw a straight line by relative offset
     * @param dv - Relative offset as [dx, dy] array
     * @returns this for method chaining
     */
    lineTo(dv: [number, number]): this;
    /**
     * Draw a straight line by relative offset
     * @param dx - X-axis offset from current position
     * @param dy - Y-axis offset from current position
     * @returns this for method chaining
     */
    lineTo(dx: number, dy: number): this;
    lineTo(dx: number | [number, number], dy?: number): this {
        if (Array.isArray(dx)) return this.lineTo(dx[0], dx[1]);
        Check.validateNumber(+dx, "PathPen.lineTo", 1);
        Check.validateNumber(+dy, "PathPen.lineTo", 2);
        this.result += `l${(+dx).toFixed(0)},${(+dy).toFixed(0)}`;
        return this;
    }

    /** Alias for LineTo */
    LinkTo = this.LineTo;
    /** Alias for lineTo */
    linkTo = this.lineTo;

    /**
     * Draw a cubic bezier curve to absolute coordinates
     * Array-based overload for convenient point specification
     * @param v1 - First control point as [x1, y1] array
     * @param v2 - Second control point as [x2, y2] array
     * @param v - End point as [x, y] array
     * @returns this for method chaining
     */
    Cubic(v1: [number, number], v2: [number, number], v: [number, number]): this;
    /**
     * Draw a cubic bezier curve to absolute coordinates
     * Individual coordinate overload for explicit parameter specification
     * @param x1 - First control point x coordinate
     * @param y1 - First control point y coordinate
     * @param x2 - Second control point x coordinate
     * @param y2 - Second control point y coordinate
     * @param x - End point x coordinate
     * @param y - End point y coordinate
     * @returns this for method chaining
     */
    Cubic(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this;
    Cubic(x1: any, y1: any, x2?: any, y2?: number, x?: number, y?: number): this {
        if (Array.isArray(x1)) {
            const [v1, v2, v] = arguments;
            return this.Cubic(v1[0], v1[1], v2[0], v2[1], v[0], v[1]);
        }
        [x1, y1, x2, y2, x, y].forEach((v, i) => Check.validateNumber(+v, "PathPen.Cubic", i + 1));
        this.result += `C${(+x1).toFixed(0)},${(+y1).toFixed(0)},${(+x2).toFixed(0)},${(+y2).toFixed(0)},${(+x).toFixed(
            0
        )},${(+y).toFixed(0)}`;
        return this;
    }

    /**
     * Draw a cubic bezier curve by relative offsets
     * Array-based overload for convenient offset specification
     * @param dv1 - First control point offset as [dx1, dy1] array
     * @param dv2 - Second control point offset as [dx2, dy2] array
     * @param dv - End point offset as [dx, dy] array
     * @returns this for method chaining
     */
    cubic(dv1: [number, number], dv2: [number, number], dv: [number, number]): this;
    /**
     * Draw a cubic bezier curve by relative offsets
     * Individual offset overload for explicit parameter specification
     * @param dx1 - First control point x offset
     * @param dy1 - First control point y offset
     * @param dx2 - Second control point x offset
     * @param dy2 - Second control point y offset
     * @param dx - End point x offset
     * @param dy - End point y offset
     * @returns this for method chaining
     */
    cubic(dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number): this;
    cubic(dx1: any, dy1: any, dx2?: any, dy2?: number, dx?: number, dy?: number): this {
        if (Array.isArray(dx1)) {
            const [dv1, dv2, dv] = arguments;
            return this.cubic(dv1[0], dv1[1], dv2[0], dv2[1], dv[0], dv[1]);
        }
        [dx1, dy1, dx2, dy2, dx, dy].forEach((v, i) => Check.validateNumber(+v, "PathPen.cubic", i + 1));
        this.result += `c${(+dx1).toFixed(0)},${(+dy1).toFixed(0)},${(+dx2).toFixed(0)},${(+dy2).toFixed(
            0
        )},${(+dx).toFixed(0)},${(+dy).toFixed(0)}`;
        return this;
    }

    /**
     * Draw a quadratic bezier curve to absolute coordinates
     * Array-based overload for convenient point specification
     * @param v1 - Control point as [x1, y1] array
     * @param v - End point as [x, y] array
     * @returns this for method chaining
     */
    Quad(v1: [number, number], v: [number, number]): this;
    /**
     * Draw a quadratic bezier curve to absolute coordinates
     * Individual coordinate overload for explicit parameter specification
     * @param x1 - Control point x coordinate
     * @param y1 - Control point y coordinate
     * @param x - End point x coordinate
     * @param y - End point y coordinate
     * @returns this for method chaining
     */
    Quad(x1: number, y1: number, x: number, y: number): this;
    Quad(x1: any, y1: any, x?: number, y?: number): this {
        if (Array.isArray(x1)) {
            const [v1, v] = arguments;
            return this.Quad(v1[0], v1[1], v[0], v[1]);
        }
        [x1, y1, x, y].forEach((v, i) => Check.validateNumber(+v, "PathPen.Quad", i + 1));
        this.result += `Q${(+x1).toFixed(0)},${(+y1).toFixed(0)},${(+x).toFixed(0)},${(+y).toFixed(0)}`;
        return this;
    }

    /**
     * Draw a quadratic bezier curve by relative offsets
     * Array-based overload for convenient offset specification
     * @param dv1 - Control point offset as [dx1, dy1] array
     * @param dv - End point offset as [dx, dy] array
     * @returns this for method chaining
     */
    quad(dv1: [number, number], dv: [number, number]): this;
    /**
     * Draw a quadratic bezier curve by relative offsets
     * Individual offset overload for explicit parameter specification
     * @param dx1 - Control point x offset
     * @param dy1 - Control point y offset
     * @param dx - End point x offset
     * @param dy - End point y offset
     * @returns this for method chaining
     */
    quad(dx1: number, dy1: number, dx: number, dy: number): this;
    quad(dx1: any, dy1: any, dx?: number, dy?: number): this {
        if (Array.isArray(dx1)) {
            const [dv1, dv] = arguments;
            return this.quad(dv1[0], dv1[1], dv[0], dv[1]);
        }
        [dx1, dy1, dx, dy].forEach((v, i) => Check.validateNumber(+v, "PathPen.quad", i + 1));
        this.result += `q${(+dx1).toFixed(0)},${(+dy1).toFixed(0)},${(+dx).toFixed(0)},${(+dy).toFixed(0)}`;
        return this;
    }

    /**
     * Draw an elliptical arc to absolute coordinates
     * Array-based overload for convenient point specification
     * @param r - Ellipse radii as [rx, ry] array
     * @param rotation - X-axis rotation angle in degrees
     * @param large - Large arc flag: 0 for small arc, 1 for large arc
     * @param sweep - Sweep direction: 0 for counter-clockwise, 1 for clockwise
     * @param v - End point as [x, y] array
     * @returns this for method chaining
     */
    Arc(r: [number, number], rotation: number, large: 0 | 1, sweep: 0 | 1, v: [number, number]): this;
    /**
     * Draw an elliptical arc to absolute coordinates
     * Individual coordinate overload for explicit parameter specification
     * @param rx - Ellipse x-axis radius
     * @param ry - Ellipse y-axis radius
     * @param rotation - X-axis rotation angle in degrees
     * @param large - Large arc flag: 0 for small arc, 1 for large arc
     * @param sweep - Sweep direction: 0 for counter-clockwise, 1 for clockwise
     * @param x - End point x coordinate
     * @param y - End point y coordinate
     * @returns this for method chaining
     */
    Arc(rx: number, ry: number, rotation: number, large: 0 | 1, sweep: 0 | 1, x: number, y: number): this;
    Arc(rx: any, ry: number, rotation: number, large: 0 | 1, sweep: any, x?: number, y?: number): this {
        if (Array.isArray(rx)) {
            const [r, rot, lg, sw, v] = arguments;
            return this.Arc(r[0], r[1], rot, lg, sw, v[0], v[1]);
        }
        [rx, ry, rotation, x, y].forEach((v, i) => Check.validateNumber(+v, "PathPen.Arc", i + 1));
        if (large !== 0 && large !== 1) throw new Error(`LargeArcFlag must be 0 or 1, got ${large}`);
        if (sweep !== 0 && sweep !== 1) throw new Error(`SweepFlag must be 0 or 1, got ${sweep}`);
        this.result += `A${(+rx).toFixed(0)},${(+ry).toFixed(0)},${(+rotation).toFixed(
            0
        )},${large},${sweep},${(+x).toFixed(0)},${(+y).toFixed(0)}`;
        return this;
    }

    /**
     * Draw an elliptical arc by relative offsets
     * Array-based overload for convenient offset specification
     * @param r - Ellipse radii as [rx, ry] array
     * @param rotation - X-axis rotation angle in degrees
     * @param large - Large arc flag: 0 for small arc, 1 for large arc
     * @param sweep - Sweep direction: 0 for counter-clockwise, 1 for clockwise
     * @param dv - End point offset as [dx, dy] array
     * @returns this for method chaining
     */
    arc(r: [number, number], rotation: number, large: 0 | 1, sweep: 0 | 1, dv: [number, number]): this;
    /**
     * Draw an elliptical arc by relative offsets
     * Individual offset overload for explicit parameter specification
     * @param rx - Ellipse x-axis radius
     * @param ry - Ellipse y-axis radius
     * @param rotation - X-axis rotation angle in degrees
     * @param large - Large arc flag: 0 for small arc, 1 for large arc
     * @param sweep - Sweep direction: 0 for counter-clockwise, 1 for clockwise
     * @param dx - End point x offset
     * @param dy - End point y offset
     * @returns this for method chaining
     */
    arc(rx: number, ry: number, rotation: number, large: 0 | 1, sweep: 0 | 1, dx: number, dy: number): this;
    arc(rx: any, ry: number, rotation: number, large: 0 | 1, sweep: any, dx?: number, dy?: number): this {
        if (Array.isArray(rx)) {
            const [r, rot, lg, sw, dv] = arguments;
            return this.arc(r[0], r[1], rot, lg, sw, dv[0], dv[1]);
        }
        [rx, ry, rotation, dx, dy].forEach((v, i) => Check.validateNumber(+v, "PathPen.arc", i + 1));
        if (large !== 0 && large !== 1) throw new Error(`LargeArcFlag must be 0 or 1, got ${large}`);
        if (sweep !== 0 && sweep !== 1) throw new Error(`SweepFlag must be 0 or 1, got ${sweep}`);
        this.result += `a${(+rx).toFixed(0)},${(+ry).toFixed(0)},${(+rotation).toFixed(
            0
        )},${large},${sweep},${(+dx).toFixed(0)},${(+dy).toFixed(0)}`;
        return this;
    }

    /**
     * Close the current path by drawing a straight line to the starting point
     * Creates a closed shape
     */
    ClosePath(): this {
        this.result += "Z";
        return this;
    }

    /**
     * Close the current path by drawing a straight line to the starting point
     * Creates a closed shape (relative version, functionally identical to ClosePath)
     */
    closePath(): this {
        this.result += "z";
        return this;
    }
}
