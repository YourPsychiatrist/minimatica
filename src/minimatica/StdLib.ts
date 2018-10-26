import { SymbolTable } from "./SymbolTable";
import { Console } from "./Console";
import { matrixWithDimensions, vectorWithDimensions } from "./stdlib/Matrix";
import { Function } from "./stdlib/Function";
import { cos, sin, tan } from "./stdlib/Geometry";
import { add, subtract, multiply, dividedBy, modulo } from "./stdlib/Arithmetic";
import { fact, binomial } from "./stdlib/Algebra";

export class StdLib {

  static console: Console | any = window.console;

  static readonly Arithmetic = {
    ADD: add,
    SUBTRACT: subtract,
    MULTIPLY: multiply,
    DIVIDE_BY: dividedBy,
    MODULO: modulo,
  };

  static readonly IO = {
    // Note: f can not be shortened to StdLib.console.log, it ust be a function expression
    PRINT: { name: "print", f: (...args: any) => StdLib.console.log(...args) }
  };

  static readonly Algebra = {
    DERIVE: { name: "derive", f: (f: Function) => f.derive() },
    INTEGRATE: { name: "integrate", f: (f: Function) => f.integrate() },
    FACTORIAL: { name: "fact", f: fact },
    SINE: { name: "sin", f: sin },
    COSINE: { name: "cos", f: cos },
    TANGENT: { name: "tan", f: tan },
    BINOMIAL: { name: "binomial", f: binomial }
  };

  static readonly Types = {
    MATRIX: { name: "mat", f: matrixWithDimensions },
    VECTOR: { name: "vec", f: vectorWithDimensions }
  };

  private static defineAllInGroup(group: string, table: SymbolTable): void {
    if (StdLib[ group ] === undefined) {
      throw new Error(`Failed to load standard library: Function group "${group}" does not exist.`);
    }
    for (let Func of Object.keys(StdLib[ group ])) {
      table.define(StdLib[ group ][ Func ].name, StdLib[ group ][ Func ].f);
    }
  }

  static preloadedSymbolTable(): SymbolTable {
    const table = new SymbolTable();

    // ---- FUNCTIONS ----
    // -- IO --
    StdLib.defineAllInGroup("IO", table);

    // -- ALGEBRA --
    StdLib.defineAllInGroup("Algebra", table);

    // ---- TYPES ----
    StdLib.defineAllInGroup("Types", table);

    return table;
  }
}