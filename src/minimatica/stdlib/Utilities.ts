/**
 * This function is mainly used for resolving the use of arithmetic
 * operators in minimatica, so that 3*3 is treated as "native"
 * multiplication" and matrix1*matrix2 is resolved to
 * matrix1.multiply(matrix2).
 * @return True if both operators are of type <i>number</i>.
 */
export function bothOperandsNumbers(a: any, b: any): boolean {
  return typeof a === "number" && typeof b === "number";
}
