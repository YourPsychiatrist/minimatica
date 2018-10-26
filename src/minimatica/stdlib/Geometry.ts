export function toRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

export function sin(x: number): number {
  return Math.sin(toRadians(x));
}

export function cos(x: number): number {
  return Math.cos(toRadians(x));
}

export function tan(x: number): number {
  return Math.tan(toRadians(x));
}