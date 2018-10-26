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