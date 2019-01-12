//// The implementation of Scanner and parser are very sparsely documented since
//// I was following a basic procedure, generating the systems from the Minimatica EBNF.
import { Scanner, Token } from "./Scanner";
import { SymbolTable } from "./SymbolTable";
import { StdLib } from "./StdLib";
import { Function } from "./stdlib/Function";
import { asCallable } from "./stdlib/Callable";

/**
 * Since doesn't know how to call by reference, all
 * transitional parameters have to be wrapped in an
 * object to simulate reference-like behaviour.
 */
interface TransitionalParameter {
  value: any;
}

/**
 * The Minimatica Parser / Interpreter.
 */
export class Parser {

  /**
   * The text being parsed.
   */
  private _sourceText: string;

  /**
   * States whether the parser has run into
   * any errors during the parsing process.
   */
  private _success: boolean;

  /**
   * The scanner performing the lexical analysis.
   */
  private _scanner: Scanner;

  /**
   * The table of symbols defined within the source text.
   */
  private _symbolTable: SymbolTable;

  constructor(sourceText: string) {
    this._sourceText = sourceText;
    this._success = true;
    this._scanner = new Scanner(sourceText);
    this._symbolTable = StdLib.preloadedSymbolTable();
  }

  /**
   * Starts the parsing / interpretation process.
   */
  parse(): void {
    this.consumeToken();
    while (!this.isToken(Token.EndOfFile) && this._success) {
      this.statement();
      this.assertToken(Token.StatementTerminator);
      this.consumeToken();
    }
  }

  /**
   * @return True if the specified token matches the token most recently
   *         found by the scanner.
   */
  private isToken(token: Token): boolean {
    return this._scanner.getCurrentToken() === token;
  }

  /**
   * Asserts that the current token is equal to the supplied one.
   * @throws If those tokens do not match.
   */
  private assertToken(token: Token): boolean {
    // strange code but we learned it that way, might change it later
    this._success = this._success && this.isToken(token);
    if (!this._success) {
      this.unexpectedToken();
    }
    return this._success;
  }

  /**
   * Reads the next token from the source text.
   */
  private consumeToken(): void {
    this._scanner.readToken();
  }

  /**
   * Aborts interpretation with an error message.
   * @param msg The error message to include.
   */
  private issueError(msg: string): void {
    this._success = false;
    const pos = this._scanner.currentPosition();
    throw new Error(`${ msg } [Line ${ pos.line }]`);
  }

  /**
   * Aborts interpretation with the message that the current token
   * is not allowed at this point in the grammar.
   */
  private unexpectedToken(): void {
    this.issueError(`Unexpected token "${ this._scanner.getCurrentToken() }"`);
  }

  /**
   * Aborts interpretation with the message that the most recently
   * found identifier is not known to the system.
   * @param name The found identifier.
   */
  private notDefined(name: string): void {
    this.issueError(`"${ name }" is not defined.`);
  }

  // -------------------------------------------- GRAMMAR -------------------------------------------- //

  private statement(): void {
    if (this.isToken(Token.Var)) {
      this.consumeToken();
      this.variableDefinition();
    } else {
      this.expression({ value: undefined });
    }
  }

  private variableDefinition(): void {
    let name: string;
    const param: TransitionalParameter = { value: undefined };
    this.assertToken(Token.Identifier);
    name = this._scanner.getIdentifier();
    if (this._symbolTable.contains(name)) {
      this.issueError(`Redefinition of variable "${ name }".`);
    }
    this.consumeToken();
    this.assertToken(Token.Assignment);
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
      if (this.isToken(Token.Identifier) && this._scanner.lookAhead() === Token.Assignment) {
        this.assignment(param);
      } else {
        this.term(param);
      }
    }
  }

  private assignment(param: TransitionalParameter): void {
    const name = this._scanner.getIdentifier();
    if (!this._symbolTable.contains(name)) {
      this.notDefined(name);
    }
    this.consumeToken();
    this.assertToken(Token.Assignment);
    this.consumeToken();
    this.expression(param);
    this._symbolTable.define(name, param.value);
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
      op = Operation[this._scanner.getCurrentToken()];
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
      this.assertToken(Token.GenericEnd);
      f = asCallable(f)(...dimensions);
      this.consumeToken();
    }
    this.assertToken(Token.LeftPar);
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
      this.assertToken(Token.RightPar);
    }

    param.value = asCallable(f)(...args);
    this.consumeToken();
  }

  private lambda(param: TransitionalParameter): void {
    let name: string; // only one item in capture list!!
    const localSymbols = this._symbolTable.clone();
    if (this.isToken(Token.Identifier)) {
      name = this._scanner.getIdentifier();
      localSymbols.declare(name);
      this.consumeToken();
      while (this.isToken(Token.Comma)) {
        this.consumeToken();
        this.assertToken(Token.Identifier);
        name = this._scanner.getIdentifier();
        localSymbols.declare(name);
      }
    }
    this.assertToken(Token.CaptureEnd);
    this.consumeToken();
    this.assertToken(Token.LambdaArrow);
    this.consumeToken();
    this.polynomial(localSymbols, param);
  }

  private polynomial(localSymbols: SymbolTable, param: TransitionalParameter): void {
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

    if (name.value !== undefined && !localSymbols.contains(name.value)) {
      this.issueError(`Variable "${ name.value }" is not captured.`);
    } else if (newExponent.value < 0) {
      this.issueError(`The minimum degree for polynomials is 0`);
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
      if (!localSymbols.contains(name.value)) {
        this.issueError(`Variable "${ name.value }" is not captured.`);
      } else if (newExponent.value < 0) {
        this.issueError(`The minimum degree for polynomials is 0`);
      }
      coefficients.push(applySign(newCoefficient.value));
      exponents.push(newExponent.value);
    }
    const maxExponent = exponents.reduce((acc, curr) => Math.max(acc, curr), -1);
    let orderedCoefficients = new Array(maxExponent);
    exponents.forEach((exponent, index) => {
      orderedCoefficients[exponent] = coefficients[index];
    });
    param.value = new Function(orderedCoefficients);
  }

  private polynomComponent(coefficient: TransitionalParameter,
                           name: TransitionalParameter,
                           exponent: TransitionalParameter): void {
    exponent.value = 1;
    coefficient.value = 1;
    const la = this._scanner.lookAhead();
    // additive constant
    if (this.isToken(Token.Subtraction) || this.isToken(Token.Number) && la != Token.Identifier) {
      exponent.value = 0;
      this.term(coefficient);
    } else {
      if (this.isToken(Token.Subtraction) || this.isToken(Token.Number)) {
        this.term(coefficient);
      } else if (this.isToken(Token.Identifier) && this._scanner.lookAhead() === Token.LeftPar) {
        this.term(coefficient);
      }
      this.assertToken(Token.Identifier);
      name.value = this._scanner.getIdentifier();
      this.consumeToken();
      if (this.isToken(Token.Exponential)) {
        this.consumeToken();
        this.assertToken(Token.LeftPar);
        this.consumeToken();
        this.term(exponent);
        this.assertToken(Token.RightPar);
        this.consumeToken();
      }
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
    while (this.isToken(Token.Multiplication) ||
    this.isToken(Token.Division) ||
    this.isToken(Token.Modulo)) {
      op = Operation[this._scanner.getCurrentToken()];
      this.consumeToken();
      this.multiplicative(tmp);
      param.value = op(param.value, tmp.value);
    }
  }

  private multiplicative(param: TransitionalParameter): void {
    let name: string;
    switch (this._scanner.getCurrentToken()) {
      case Token.Number:
      case Token.Subtraction:
        this.number(param);
        break;
      case Token.Identifier:
        const la = this._scanner.lookAhead();
        if (la === Token.LeftPar || la === Token.GenericBegin) {
          this.functionCall(param);
        } else {
          name = this._scanner.getIdentifier();
          if (!this._symbolTable.contains(name)) {
            this.notDefined(name);
          }
          param.value = this._symbolTable.valueOf(name);
          this.consumeToken();
        }
        break;
      case Token.LeftPar:
        this.consumeToken();
        this.expression(param);
        this.assertToken(Token.RightPar);
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
      this.consumeToken();
    }
    param.value = this._scanner.getNumber();
    if (negate) {
      param.value *= -1;
    }
    this.consumeToken();
  }

  // -------------------------------------------- END GRAMMAR -------------------------------------------- //
}