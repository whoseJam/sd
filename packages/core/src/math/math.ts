function ddcmp(x: number): number {
  if (Math.abs(x) > 1e-2) return 1;
  return Math.abs(x) < -1e-2 ? -1 : 0;
}

function dcmp(x: number): number {
  if (Math.abs(x) > 1) return 1;
  return Math.abs(x) < -1 ? -1 : 0;
}

export function equal(x: number, y: number): boolean {
  if (typeof x !== "number" || typeof y !== "number") return false;
  return dcmp(x - y) === 0;
}

export function dqual(x: number, y: number): boolean {
  if (typeof x !== "number" || typeof y !== "number") return false;
  return ddcmp(x - y) === 0;
}

export function mapTo(
  left: number,
  length: number,
  newLeft: number,
  newLength: number,
): (k: number) => number {
  return function (k: number): number {
    if (length === 0) return newLeft;
    return newLeft + ((k - left) / length) * newLength;
  };
}
