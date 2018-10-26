import { Callable } from "./Callable";

export class Function implements Callable {

  readonly coefficients: number[];

  constructor(coefficients: number[]) {
    this.coefficients = coefficients;
  }

  apply(x: number) {
    let result = 0;
    for (let i = 0; i < this.coefficients.length; ++i) {
      const exponent = this.coefficients.length - i - 1;
      result += this.coefficients[ i ] * Math.pow(x, exponent);
    }
    return result;
  }

  derive(): Function {
    const derivedCoefficients: number[] = this.coefficients.map((coeff, index, arr) => {
      const exponent = arr.length - index - 1;
      return coeff*exponent;
    });
    derivedCoefficients.pop();
    return new Function(derivedCoefficients);
  }

  integrate(): Function {
    const derivedCoefficients: number[] = this.coefficients.map((coeff, index, arr) => {
      const exponent = arr.length - index - 1;
      if (coeff === 0) {
        return 0;
      } else {
        return coeff / (exponent + 1);
      }
    });
    derivedCoefficients.push(0);
    return new Function(derivedCoefficients);
  }

  toString(): string {
    let polynom = "f(x)=";
    this.coefficients.forEach((coeff, index, arr) => {
      if (coeff !== 0) {
        const exponent = arr.length - index - 1;
        let absCoeff: number | string = Math.abs(coeff);
        if (Math.trunc(absCoeff) !== absCoeff) {
          absCoeff = absCoeff.toFixed(2);
        }
        if (coeff > 0) polynom += '+';
        else if (coeff < 0) polynom += '-';
        if (absCoeff !== 1 || exponent === 0) polynom += absCoeff;
        if (exponent !== 0) {
          polynom += 'x';
          if (exponent !== 1) polynom += '^' + exponent;
        }
      }
    });
    return polynom;
  }

}