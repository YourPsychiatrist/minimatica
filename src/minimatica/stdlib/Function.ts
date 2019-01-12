import { Callable } from "./Callable";

/**
 * Represents a function in polynomial form.
 */
export class Function implements Callable {

  /**
   * An array of coefficients c_i for
   * x^i where i is the index for the array.
   *
   * e.g. [1,-2,3] represents 3x^2 - 2x + 1
   */
  readonly coefficients: number[];

  constructor(coefficients: number[]) {
    this.coefficients = coefficients;
  }

  /**
   * Applies the function to x.
   * @param x The argument to use.
   */
  apply(x: number) {
    let result = 0;
    for (let i = 0; i < this.coefficients.length; ++i) {
      result += this.coefficients[i] * Math.pow(x, i);
    }
    return result;
  }

  /**
   * @return The derivation of the function.
   */
  derive(): Function {
    const derivedCoefficients: number[] = this.coefficients.map((coeff, index) => {
      return coeff * index; // index == exponent
    });
    if (derivedCoefficients.length > 1) {
      derivedCoefficients.shift();
    }
    return new Function(derivedCoefficients);
  }

  /**
   * @return The indefinite integral of the function.
   */
  integrate(): Function {
    const integratedCoefficients: number[] = this.coefficients.map((coeff, index) => {
      return coeff / (index + 1); // index == exponent
    });
    integratedCoefficients.unshift(0);
    return new Function(integratedCoefficients);
  }

  /**
   * Returns the polynomial form of the function as string.
   */
  toString(): string {
    let polynomial = "f(x)=";
    // start with the polynomial of the highest degree
    for (let i = this.coefficients.length - 1; i >= 0; --i) {
      const coeff = this.coefficients[i];
      if (this.coefficients[i] != 0) {
        const exponent = i;

        // truncate non-natural numbers
        let absCoeff: number | string = Math.abs(coeff);
        if (Math.trunc(absCoeff) !== absCoeff) {
          // round to 2 decimal places and truncate trailing 0s
          absCoeff = absCoeff.toFixed(2).replace(/0*$/, "");
        }

        // add the sign
        if (coeff > 0) polynomial += '+';
        else if (coeff < 0) polynomial += '-';

        // do not print coefficient 1 and coefficients to polynomials of degree 0
        if (absCoeff !== 1 || exponent === 0) polynomial += absCoeff;

        // print the polynomial itself
        if (exponent !== 0) {
          polynomial += 'x';
          if (exponent !== 1) polynomial += '^' + exponent;
        }
      }
    }
    return polynomial;
  }

}