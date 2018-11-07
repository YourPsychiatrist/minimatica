export function toRadians(degrees: number) {
  return (degrees * Math.PI / 180);
}

function fixed10(x: number): number {
  // fixes inaccurate binary representation problem:
  // cos(90) was not 0 at the 17th digit after the
  // decimal point.
  return parseInt(x.toFixed(10));
}

export function sin(x: number): number {
  return fixed10(Math.sin(toRadians(x)));
}

export function cos(x: number): number {
  return fixed10(Math.cos(toRadians(x)));
}

export function tan(x: number): number {
  return fixed10(Math.tan(toRadians(x)));
}