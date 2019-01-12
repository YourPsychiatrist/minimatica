/**
 * Represents a m*n matrix.
 */
export class Matrix {

  /**
   * The number of rows this matrix has.
   */
  readonly rows: number;

  /**
   * The number of columns this matrix has.
   */
  readonly columns: number;

  /**
   * The two dimensional array of values with the
   * first dimension being the rows and the second
   * one being the columns.
   */
  readonly data: number[][];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;

    this.data = new Array(rows);
    for (let i = 0; i < rows; ++i) {
      this.data[i] = new Array(columns);
    }
  }

  /**
   * Fills the matrix with the supplied values.
   */
  setValues(values: number[]): void {
    if (values.length !== this.rows * this.columns) {
      throw new Error(`Can not initialize a ${ this.rows }x${ this.columns } matrix with ${ values.length } values.`);
    }
    for (let row = 0; row < this.rows; ++row) {
      for (let col = 0; col < this.columns; col++) {
        this.data[row][col] = values[row * this.columns + col];
      }
    }
  }

  /**
   * @see multiplyMat
   * @see multiplyNum
   */
  multiply(val: Matrix | number) {
    if (typeof val === "number") {
      return this.multiplyNum(val);
    } else {
      return this.multiplyMat(val);
    }
  }

  /**
   * Multiplies all entries of the matrix with the supplied number.
   */
  private multiplyNum(num: number): Matrix {
    const args: number[] = this.data.slice().map((value: any) => value * num);
    return matrixWithDimensions(this.rows, this.columns)(...args);
  }

  /**
   * Performs matrix multiplication using this and the supplied matrix as operands.
   */
  private multiplyMat(mat: Matrix): Matrix {
    if (this.columns !== mat.rows) {
      throw new Error(`You can not multiply a mat<${ this.rows },${ this.columns }> with a mat<${ mat.rows }, ${ mat.columns }>`);
    }
    const args: number[] = [];
    for (let row = 0; row < this.rows; ++row) {
      for (let column = 0; column < mat.columns; ++column) {
        let sum = 0;
        for (let i = 0; i < this.columns; ++i) {
          sum += this.data[row][i] * mat.data[i][column];
        }
        args[row * this.columns + column] = sum;
      }
    }
    return matrixWithDimensions(this.rows, mat.columns)(...args);
  }

  /**
   * @return A formatted version of the matrix as String.
   */
  toString(): string {
    let str = "";
    for (let row = 0; row < this.rows; ++row) {
      str += "|";
      for (let col = 0; col < this.columns; ++col) {
        const val = this.data[row][col];
        if (val >= 0) {
          // accounts for signed values
          str += " ";
        }
        str += val.toFixed(2);
        if (col + 1 < this.columns) {
          str += ", ";
        }
      }
      str += "|";
      if (row + 1 < this.rows) {
        str += "\n";
      }
    }
    return str;
  }
}

/**
 * Returns a function which can be invoked with rows*columns
 * values in order to create a respectively sized matrix filled
 * with those values.
 * @param rows The number of rows.
 * @param columns The number of columns.
 */
export function matrixWithDimensions(rows: number, columns: number) {
  return (...values: number[]) => {
    const matr = new Matrix(rows, columns);
    matr.setValues(values);
    return matr;
  };
}

/**
 * @param rows The number of rows the vector should have.
 * @return A matrix with the specified number of rows and one column.
 */
export function vectorWithDimensions(rows: number) {
  return matrixWithDimensions(rows, 1);
}