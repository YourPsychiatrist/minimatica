import { SymbolTable } from "./SymbolTable";
import { Console } from "./Console";
import { matrixWithDimensions, vectorWithDimensions } from "./stdlib/Matrix";
import { Function } from "./stdlib/Function";
import { cos, sin, tan } from "./stdlib/Trigonometry";
import {
  add,
  subtract,
  multiply,
  dividedBy,
  modulo,
  pow,
  sqrt,
  random,
  floor,
  ceiling,
  round
} from "./stdlib/Arithmetic";
import { fact, binomial } from "./stdlib/Algebra";

/**
 * This class is a wrapper for the standard Minimatica symbol table.
 */
export class StdLib {

  /**
   * The console used for printing.
   */
  static console: Console | any = window.console;

  /**
   * Functions that can be classified as arithmetical operations.
   */
  static readonly Arithmetic = {
    ADD: add,
    SUBTRACT: subtract,
    MULTIPLY: multiply,
    DIVIDE_BY: dividedBy,
    MODULO: modulo,
  };

  /**
   * Functions which provide an IO interface for the Minimatica system.
   * (Would be pretty boring if you couldn't see the results of computations
   * wouldn't it?)
   */
  static readonly IO = {
    // Note: f can not be shortened to StdLib.console.log, it must be a function expression!
    PRINT: { name: "print", f: (...args: any) => StdLib.console.log(...args) }
  };

  /**
   * This is where the real math happens.
   */
  static readonly Algebra = {
    DERIVE: { name: "derive", f: (f: Function) => f.derive() },
    INTEGRATE: { name: "integrate", f: (f: Function) => f.integrate() },
    FACTORIAL: { name: "fact", f: fact },
    SINE: { name: "sin", f: sin },
    COSINE: { name: "cos", f: cos },
    TANGENT: { name: "tan", f: tan },
    BINOMIAL: { name: "binomial", f: binomial },
    POWER: { name: "pow", f: pow },
    SQRT: { name: "sqrt", f: sqrt },
    RANDOM: { name: "random", f: random },
    FLOOR: { name: "floor", f: floor },
    CEILING: { name: "ceiling", f: ceiling },
    ROUND: { name: "round", f: round },
    E: { name: "e", f: Math.E },
    PI: { name: "pi", f: Math.PI }
  };

  /**
   * Non-primitive types in Minimatica.
   */
  static readonly Types = {
    MATRIX: { name: "mat", f: matrixWithDimensions },
    VECTOR: { name: "vec", f: vectorWithDimensions }
  };

  /**
   * Populates the symbol table with definitions for all
   * names within the supplied name group.
   * @param group The name group to define.
   * @param table The symbol table in which to define the names.
   */
  private static defineAllInGroup(group: string, table: SymbolTable): void {
    if (StdLib[group] === undefined) {
      throw new Error(`Failed to load standard library: Name group "${ group }" does not exist.`);
    }
    for (let Func of Object.keys(StdLib[group])) {
      table.define(StdLib[group][Func].name, StdLib[group][Func].f);
    }
  }

  /**
   * @return A symbol table that comes pre-loaded with all types, functions
   *         and constants provided by the StdLib.
   */
  static preloadedSymbolTable(): SymbolTable {
    const table = new SymbolTable();
    StdLib.defineAllInGroup("IO", table);
    StdLib.defineAllInGroup("Algebra", table);
    StdLib.defineAllInGroup("Types", table);
    return table;
  }
}