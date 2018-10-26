import { Scanner, Token } from "./Scanner";
import { SymbolTable } from "./SymbolTable";
import { Console } from "./Console";
import { StdLib } from "./StdLib";
import { Function } from "./stdlib/Function";
import { asCallable } from "./stdlib/Callable";

interface TransitionalParameter {
  value: any;
}

export class Parser {

  private _sourceText: string;

  private _success: boolean;

  private _scanner: Scanner;

  private _symbolTable: SymbolTable;

  private _console: Console;

  constructor(sourceText: string, console?: Console) {
    this._sourceText = sourceText;
    if (console) {
      this._console = console;
      StdLib.console = console;
    }
    this._success = true;
    this._scanner = new Scanner(sourceText, console);
    this._symbolTable = StdLib.preloadedSymbolTable();
  }

  parse(): void {
    this.consumeToken();
    this.statement();
    while (!this.isToken(Token.EndOfFile) && this._success) {
      if (!this.assertToken(Token.StatementTerminator)) {
        return;
      }
      this.consumeToken();
      this.statement();
    }
  }

  private isToken(token: Token): boolean {
    return this._scanner.getCurrentToken() === token;
  }

  private assertToken(token: Token): boolean {
    // strange code but we learned it that way, might change it later
    this._success = this._success && this.isToken(token);
    if (!this._success) {
      this.unexpectedToken();
    }
    return this._success;
  }

  private consumeToken(): void {
    // console.log("consumed", this._scanner.getCurrentToken());
    this._scanner.readToken();
  }

  private issueError(msg: string): void {
    this._success = false;
    this._console.error(msg);
  }

  private unexpectedToken(): void {
    this.issueError(`Unexpected token "${this._scanner.getCurrentToken()}"`);
  }

  private notDefined(name: string): void {
    this.issueError(`Entity "${name}" is not defined.`);
  }

  private statement(): void {
    if (this.isToken(Token.Var)) {
      this.consumeToken();
      this.variableDefinition();
    } else {
      this.expression({ value: undefined });
    }
  }

  private variableDefinition(): void {
    let name = "";
    const param: TransitionalParameter = { value: undefined };
    if (!this.assertToken(Token.Identifier)) {
      return;
    }
    name = this._scanner.getIdentifier();
    if (this._symbolTable.contains(name)) {
      this.issueError(`Redefinition of variable "${name}".`);
      return;
    }
    this.consumeToken();
    if (!this.assertToken(Token.Assignment)) {
      this.issueError("Variables must be initialized.");
      return;
    }
    this.consumeToken();
    this.expression(param);
    if (!this._success) {
      return;
    }
    this._symbolTable.define(name, param.value);
  }

  private expression(param: TransitionalParameter): void {
    if (this.isToken(Token.CaptureBegin)) {
      this.consumeToken();
      this.lambda(param);
    } else {
      this.term(param);
    }
  }

  private term(param: TransitionalParameter): void {
    const Operation = {
      [Token.Addition]: StdLib.Arithmetic.ADD,
      [Token.Subtraction]: StdLib.Arithmetic.SUBTRACT
    };
    let op = undefined;
    let tmp: TransitionalParameter = { value: 0 };

    this.additive(param);
    if (!this._success) {
      return;
    }
    while (this.isToken(Token.Addition) || this.isToken(Token.Subtraction)) {
      op = Operation[ this._scanner.getCurrentToken() ];
      this.consumeToken();
      this.additive(tmp);
      param.value = op(param.value, tmp.value);
    }
  }

  private functionCall(param: TransitionalParameter): void {
    let name: string;
    let dimensions: number[] = [];
    let newDimension: TransitionalParameter = { value: 0 };
    let args = [];
    let newArg: TransitionalParameter = { value: undefined };
    let f;

    name = this._scanner.getIdentifier();
    f = this._symbolTable.valueOf(name);
    if (f === undefined ||
            (!(typeof f === "function") &&
            // sadly we can not check whether f's type implements "Callable"
            !(typeof f.apply === "function"))) {
      this.notDefined(name);
      return;
    }
    this.consumeToken();
    if (this.isToken(Token.GenericBegin)) {
      this.consumeToken();
      this.number(newDimension);
      dimensions.push(newDimension.value);
      while (this.isToken(Token.Comma)) {
        this.consumeToken();
        this.number(newDimension);
        dimensions.push(newDimension.value);
      }
      if (!this.assertToken(Token.GenericEnd)) {
        return;
      }
      f = asCallable(f)(...dimensions);
      this.consumeToken();
    }
    if (!this.assertToken(Token.LeftPar)) {
      return;
    }
    this.consumeToken();
    if (!this.isToken(Token.RightPar)) {
      this.expression(newArg);
      if (!this._success) {
        return;
      }
      args.push(newArg.value);
      while (this.isToken(Token.Comma)) {
        this.consumeToken();
        this.expression(newArg);
        if (!this._success) {
          return;
        }
        args.push(newArg.value);
      }
      if (!this.assertToken(Token.RightPar)) {
        return;
      }
    }

    param.value = asCallable(f)(...args);
    this.consumeToken();
  }

  private lambda(param: TransitionalParameter): void {
    let name = ""; // only one item in capture list!!
    const localSymbols = this._symbolTable.clone();
    if (this.isToken(Token.Identifier)) {
      name = this._scanner.getIdentifier();
      localSymbols.declare(name);
      this.consumeToken();
      while (this.isToken(Token.Comma)) {
        this.consumeToken();
        if (!this.assertToken(Token.Identifier)) {
          return;
        }
        name = this._scanner.getIdentifier();
        localSymbols.declare(name);
      }
    }
    if (!this.assertToken(Token.CaptureEnd)) {
      return;
    }
    this.consumeToken();
    if (!this.assertToken(Token.LambdaArrow)) {
      return;
    }
    this.consumeToken();
    this.polynom(localSymbols, param);
  }

  private polynom(localSymbols: SymbolTable, param: TransitionalParameter): void {
    let newCoefficient: TransitionalParameter = { value: undefined };
    let coefficients: number[] = [];
    let name: TransitionalParameter = { value: undefined };
    let newExponent: TransitionalParameter = { value: undefined };
    let exponents: number[] = [];
    let applySign = (num) => num;

    if (this.isToken(Token.Subtraction)) {
      applySign = (num) => -num;
      this.consumeToken();
    }
    this.polynomComponent(newCoefficient, name, newExponent);
    if (!this._success) {
      return;
    }

    if (!localSymbols.contains(name.value)) {
      this.issueError(`Variable "${name.value}" is not captured.`);
      return;
    } else if(newExponent.value <= 0) {
      this.issueError(`Exponent for polynom components must be greater than 0.`);
      return;
    }
    coefficients.push(applySign(newCoefficient.value));
    exponents.push(newExponent.value);
    while (this.isToken(Token.Addition) || this.isToken(Token.Subtraction)) {
      let applySign = (num) => num;
      if (this.isToken(Token.Subtraction)) {
        applySign = (num) => -num;
      }
      this.consumeToken();
      this.polynomComponent(newCoefficient, name, newExponent);
      if (!this._success) {
        return;
      }
      if (!localSymbols.contains(name.value)) {
        this.issueError(`Variable "${name.value}" is not captured.`);
        return;
      } else if(newExponent.value <= 0) {
        this.issueError(`Exponent for polynom components must be greater than 0.`);
        return;
      }
      coefficients.push(applySign(newCoefficient.value));
      exponents.push(newExponent.value);
    }
    const maxExponent = exponents.reduce((acc, curr) => Math.max(acc, curr), -1);
    let orderedCoefficients = new Array(maxExponent);
    exponents.forEach((exponent, index) => {
      orderedCoefficients[maxExponent - exponent] = coefficients[index];
    });
    // .map does not work with empty entries
    for (let i = 0; i < orderedCoefficients.length; ++i) {
      orderedCoefficients[i] = orderedCoefficients[i] ? orderedCoefficients[i]: 0;
    }
    param.value = new Function(orderedCoefficients.concat([0])); // no +c for now
  }

  private polynomComponent(coefficient: TransitionalParameter,
                           name: TransitionalParameter,
                           exponent: TransitionalParameter): void {
    exponent.value = 1; // default to 1!
    coefficient.value = 1;
    if (this.isToken(Token.Subtraction) || this.isToken(Token.Number)) {
      this.term(coefficient);
    } else if (this.isToken(Token.Identifier) &&  this._scanner.lookAhead() === Token.LeftPar) {
        this.term(coefficient);
    }
    if (!this.assertToken(Token.Identifier)) {
      return;
    }
    name.value = this._scanner.getIdentifier();
    this.consumeToken();
    if (this.isToken(Token.Exponential)) {
      this.consumeToken();
      if (!this.assertToken(Token.LeftPar)) {
        return;
    }
      this.consumeToken();
      this.term(exponent);
      if (!this.assertToken(Token.RightPar)) {
        return;
      }
      this.consumeToken();
    }
  }

  private additive(param: TransitionalParameter): void {
    const Operation = {
      [Token.Multiplication]: StdLib.Arithmetic.MULTIPLY,
      [Token.Division]: StdLib.Arithmetic.DIVIDE_BY,
      [Token.Modulo]: StdLib.Arithmetic.MODULO
    };
    let op = undefined;
    let tmp: TransitionalParameter = { value: 1 };

    this.multiplicative(param);
    if (!this._success) {
      return;
    }
    while (this.isToken(Token.Multiplication) ||
        this.isToken(Token.Division) ||
        this.isToken(Token.Modulo)) {
      op = Operation[ this._scanner.getCurrentToken() ];
      this.consumeToken();
      this.multiplicative(tmp);
      param.value = op(param.value, tmp.value);
    }
  }

  private multiplicative(param: TransitionalParameter): void {
    let name = "";
    switch (this._scanner.getCurrentToken()) {
      case Token.Number:
      case Token.Subtraction:
        this.number(param);
        if (!this._success) {
          return;
        }
        break;
      case Token.Identifier:
        const la = this._scanner.lookAhead();
        if (la === Token.LeftPar || la === Token.GenericBegin) {
          this.functionCall(param);
          if (!this._success) {
            return;
          }
        } else {
          name = this._scanner.getIdentifier();
          if (!this._symbolTable.contains(name)) {
            this.notDefined(name);
            return;
          }
          param.value = this._symbolTable.valueOf(name);
          this.consumeToken();
        }
        break;
      case Token.LeftPar:
        this.consumeToken();
        this.expression(param);
        if (!this._success) {
          return;
        }
        if (!this.assertToken(Token.RightPar)) {
          return;
        }
        this.consumeToken();
        break;
      default:
        this.unexpectedToken();
        return;
    }
  }

  private number(param: TransitionalParameter): void {
    let negate = false;
    if (this.isToken(Token.Subtraction)) {
      negate = true;
      this.consumeToken()
    }
    param.value = this._scanner.getNumber();
    if (negate) {
      param.value *= -1;
    }
    this.consumeToken();
  }
}