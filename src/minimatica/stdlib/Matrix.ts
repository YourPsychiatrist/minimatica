export class Matrix {
  readonly rows: number;
  readonly columns: number;

  readonly data: number[][];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;

    this.data = new Array(rows);
    for (let i = 0; i < rows; ++i) {
      this.data[ i ] = new Array(columns);
    }
  }

  setValues(values: number[]): void {
    if (values.length !== this.rows * this.columns) {
      throw new Error(`Can not initialize a ${this.rows}x${this.columns} matrix with ${values.length} values.`)
    }
    const total = this.rows * this.columns;
    for (let i = 0; i < total; ++i) {
      this.data[Math.floor(i / this.columns)][i % this.columns] = values[i];
    }
  }

  multiply(val: Matrix | number) {
    if (typeof val === "number") {
      return this.multiplyNum(val);
    } else {
      return this.multiplyMat(val);
    }
  }

  private multiplyNum(num: number): Matrix {
    const args: number[] = this.data.slice().map((value: any) => value * num);
    return matrixWithDimensions(this.rows, this.columns)(...args);
  }

  private multiplyMat(mat: Matrix): Matrix {
    if (this.columns !== mat.rows) {
      throw new Error(`You can not multiply a mat<${this.rows},${this.columns}> with a mat<${mat.rows}, ${mat.columns}>`);
    }
    const args: number[] = [];
    for (let row = 0; row < this.rows; ++row) {
      for (let column = 0; column < mat.columns; ++column) {
        let sum = 0;
        for (let i = 0; i < this.columns; ++i) {
          sum += this.data[row][i] * mat.data[i][column];
        }
        args[row * this.rows + column] = sum;
      }
    }
    return matrixWithDimensions(this.rows, mat.columns)(...args);
  }

  toString(): string {
    let str = "(";
    for (let i = 0; i < this.rows; ++i) {
      str += this.data[i].reduce((acc, curr) => acc + curr + ", ", "");
      if (i + 1 < this.rows) {
        str += "\n";
      }
    }
    return str + ")";
  }
}

export function matrixWithDimensions(rows: number, columns: number) {
  return (...values: number[]) => {
    const matr = new Matrix(rows, columns);
    matr.setValues(values);
    return matr;
  }
}

export function vectorWithDimensions(rows: number) {
  return matrixWithDimensions(rows, 1);
}