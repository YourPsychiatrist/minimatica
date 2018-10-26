export function fact(x: number): number {
  let result = 1;
  while (x > 1) {
    result *= x--;
  }
  return result;
}

export function binomial(x: number, y: number): number {
  // noinspection JSSuspiciousNameCombination
  return fact(x) / (fact(y) * fact(x - y));
}