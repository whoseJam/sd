import * as sd from "@/sd";

export async function Gauss(grid, A, n, m) {
    grid.startN(1).startM(1);
    const svg = sd.svg();
    const C = sd.color();
    const R = sd.rule();
    const X = sd.make1d(n + 5, { u: 0, d: 1 });
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n + 1; j++) {
            grid.element(i, j).value(new sd.Math(svg).math(String(A[i][j])), R.center());
            A[i][j] = { u: A[i][j], d: 1 };
        }
    }

    let r = 0;
    for (let i = 1; i <= n; i++) {
        // 找到第 i 列不为 0 的行
        await sd.pause();
        grid.startAnimate();
        let pos = -1;
        for (let j = r + 1; j <= m; j++) {
            grid.color(j, i, C.orange);
            if (FracIsZero(A[j][i])) continue;
            if (pos === -1) pos = j;
        }
        grid.endAnimate();

        if (pos === -1) {
            await sd.pause();
            grid.startAnimate().color(C.white).endAnimate();
            continue;
        }

        r++;
        await sd.pause();
        grid.startAnimate().color(pos, i, C.green).endAnimate();
        if (r !== pos) {
            await sd.pause();
            grid.startAnimate();
            grid.color(pos, i, C.orange);
            grid.color(r, i, C.green);
            for (let j = 1, tmp; j <= n + 1; j++) {
                tmp = A[r][j];
                A[r][j] = A[pos][j];
                A[pos][j] = tmp;
                const v1 = grid.element(r, j).drop();
                const v2 = grid.element(pos, j).drop();
                grid.element(pos, j).valueFromExist(v1, R.center());
                grid.element(r, j).valueFromExist(v2, R.center());
            }
            grid.endAnimate();
        }

        // 消元
        for (let j = r + 1; j <= m; j++) {
            await sd.pause();
            const link = sd
                .Link(grid.element(r, 1), grid.element(j, 1), sd.Curve, "x", "cy", "x", "cy")
                .bending(0.5)
                .startAnimate()
                .pointStoT()
                .endAnimate()
                .arrow();
            await sd.pause();
            if (!FracIsZero(A[j][i])) {
                const c = FracDivide(A[j][i], A[r][i]);
                for (let k = i; k <= n + 1; k++) {
                    A[j][k] = FracMinus(A[j][k], FracMultiply(A[r][k], c));
                    grid.element(j, k).startAnimate();
                    grid.value(j, k).transformMath(FracToString(A[j][k]));
                    grid.element(j, k).endAnimate();
                }
            }
            await sd.pause();
            link.startAnimate().fadeStoT().endAnimate().arrow(null);
        }

        await sd.pause();
        grid.startAnimate().color(C.white).endAnimate();
    }

    if (r < n) {
        for (let i = 1; i <= m; i++) {
            let allCofZero = true;
            for (let j = 1; j <= n && allCofZero; j++) if (!FracIsZero(A[i][j])) allCofZero = false;
            if (allCofZero && !FracIsZero(A[i][n + 1])) {
                await sd.pause();
                grid.startAnimate();
                for (let j = 1; j <= n + 1; j++) {
                    grid.color(i, j, C.red);
                }
                grid.endAnimate();
                return;
            }
        }
        await sd.pause();
        let tmp = 1;
        for (let i = 1; i <= n; i++) {
            console.log("tmp=", tmp, "i=", i);
            if (FracIsZero(A[tmp][i])) {
                grid.startAnimate().color(tmp, i, C.green).endAnimate();
            } else {
                tmp++;
            }
        }
        return;
    }

    for (let i = n; i >= 1; i--) {
        await sd.pause();
        grid.startAnimate();
        let sum = { u: 0, d: 1 };
        for (let j = i + 1; j <= n; j++) {
            sum = FracPlus(sum, FracMultiply(X[j], A[i][j]));
            grid.value(i, j).transformMath("0");
        }
        sum = FracMinus(A[i][n + 1], sum);
        X[i] = FracDivide(sum, A[i][i]);
        grid.value(i, i).transformMath("1");
        grid.value(i, n + 1).transformMath(FracToString(X[i]));
        grid.endAnimate();
    }
    return X;
}

function gcd(a, b) {
    if (!b) return Math.abs(a);
    return gcd(b, a % b);
}

function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

function FracMultiply(a, b) {
    const u = a.u * b.u;
    const d = a.d * b.d;
    const g = gcd(u, d);
    return { u: u / g, d: d / g };
}

function FracDivide(a, b) {
    if (b.u < 0) {
        b.u = -b.u;
        b.d = -b.d;
    }
    const u = a.u * b.d;
    const d = a.d * b.u;
    const g = gcd(u, d);
    return { u: u / g, d: d / g };
}

function FracPlus(a, b) {
    const l = lcm(a.d, b.d);
    const u = a.u * (l / a.d) + b.u * (l / b.d);
    const d = l;
    const g = gcd(u, d);
    return { u: u / g, d: d / g };
}

function FracMinus(a, b) {
    return FracPlus(a, FracMultiply(b, { u: -1, d: 1 }));
}

function FracToString(a) {
    if (a.d === 1) return String(a.u);
    if (a.u === 0) return String(0);
    return `${a.u}/${a.d}`;
}

function FracIsZero(a) {
    return a.u === 0;
}
