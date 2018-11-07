import { bothOperandsNumbers } from "./Utilities";

export function add(a: any, b: any): any {
  if (bothOperandsNumbers(a, b)) {
    return a + b;
  } else {
    return a.add(b);
  }
}

export function subtract(a: any, b: any): any {
  if (bothOperandsNumbers(a, b)) {
    return a - b;
  } else {
    return a.subtract(b);
  }
}

export function multiply(a: any, b: any): any {
  if (bothOperandsNumbers(a, b)) {
    return a * b;
  } else {
    return a.multiply(b);
  }
}

export function dividedBy(a: any, b: any): any {
  if (bothOperandsNumbers(a, b)) {
    return a / b;
  } else {
    return a.dividedBy(b);
  }
}

export function modulo(a: any, b: any): any {
  if (bothOperandsNumbers(a, b)) {
    return a % b;
  } else {
    return a.modulo(b);
  }
}

export function pow(base: any, exp: any): any {
  if (bothOperandsNumbers(base, exp)) {
    return Math.pow(base, exp);
  } else {
    return base.pow(exp);
  }
}

export function sqrt(a: any): any {
  if (typeof a === "number") {
    return Math.sqrt(a);
  } else {
    return a.sqrt();
  }
}

export function random(): any {
  return Math.random();
}

export function floor(a: any): any {
  if (typeof a === "number") {
    return Math.floor(a);
  } else {
    return a.floor();
  }
}

export function ceiling(a: any): any {
  if (typeof a === "number") {
    return Math.ceil(a);
  } else {
    return a.ceiling();
  }
}

export function round(a: any): any {
  if (typeof a === "number") {
    return Math.round(a);
  } else {
    return a.round();
  }
}