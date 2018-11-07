import { Console } from "./Console";

/**
 * An enumeration of tokens
 * the minimatica scanner knows
 * about (/ is able to handle).
 */
export enum Token {
  Var = 'var',
  Assignment = 'ass',
  LeftPar = 'lpar',
  RightPar = 'rpar',
  Comma = 'comma',
  CaptureBegin = 'capbeg',
  CaptureEnd = 'capend',
  GenericBegin = 'genbeg',
  GenericEnd = 'genend',
  StatementTerminator = 'terminator',
  LambdaArrow = 'arw',
  Number = 'num',
  Identifier = 'ident',
  Exponential = 'exp',
  Multiplication = 'mult',
  Division = 'div',
  Addition = 'add',
  Subtraction = 'sub',
  Modulo = 'mod',
  EndOfFile = 'eof',
  Error = 'error'
}

/**
 * A compound data type storing
 * various source text positions.
 */
export interface TextPosition {
  /**
   * The absolute position of "the
   * scanner's caret" within the source
   * text.
   */
  absoluteIndex: number;

  /**
   * The number of the line currently scanned.
   */
  line: number;

  /**
   * The currently processed column relative
   * to the current line.
   */
  column: number;
}

/**
 * A function acting as callback for scanner errors.
 */
export interface ErrorFunction {
  (token: string, line: number, column: number): void;
}

/**
 * @param char The character to check.
 * @return True if the supplied character is a letter.
 */
function isAlpha(char: string): boolean {
  return /^[A-Z]$/i.test(char);
}

/**
 * @param char The character to check.
 * @return True if the supplied character is a digit.
 */
function isDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

/**
 * The state of the scanner is a compound
 * data type since this makes it easier to
 * look ahead in the scan process.
 */
interface ScannerState {
  /**
   * The currently processed character.
   */
  currentChar: string;

  /**
   * The current processing position of the scanner
   * within {@link _sourceText}.
   */
  currentPosition: TextPosition;

  /**
   * The most recently found token.
   */
  currentToken: Token;
  
  /**
   * A buffer for number literals and identifiers.
   */
  literalBuffer: string;
}

/**
 * The scanner class is responsible for the lexical
 * analysis of minimatica source code.
 */
export class Scanner {

  /**
   * The EOF character.
   */
  private static readonly END_OF_FILE = '\u0000';

  /**
   * The tab character.
   */
  private static readonly TAB = '\t';

  /**
   * The newline character.
   */
  private static readonly NEW_LINE = '\n';

  /**
   * The minimatica source code this scanner scans.
   */
  private readonly _sourceText: string;

  /**
   * The state of this scanner.
   */
  private _state: ScannerState;

  // TODO documentation
  private _console: Console;

  /**
   * An error function which is called as soon as the
   * scanner encounters unknown tokens.
   */
  onError: ErrorFunction;

  /**
   * @param sourceText The minimatica source to scan.
   * @param console The console to log errors to.
   */
  constructor (sourceText: string, console?: Console) {
    this._state = {
      currentChar: '',
      currentPosition: <TextPosition>{
        absoluteIndex: 0,
        line: 1,
        column: 1
      },
      literalBuffer: '',
      currentToken: undefined
    };
    this.onError = () => {};
    this._sourceText = sourceText;
    this._console = console;

    this.readChar();
  }

  /**
   * Reads the next char in the minimatica source text.
   */
  readChar(): void {
    // if EOF not reached
    if (this._state.currentPosition.absoluteIndex + 1 <= this._sourceText.length) {
      // if EOL not reached
      if (this._sourceText[this._state.currentPosition.absoluteIndex] === Scanner.NEW_LINE) {
        this._state.currentPosition.column = 1;
        this._state.currentPosition.line += 1;
      } else {
        this._state.currentPosition.column += 1;
      }
      this._state.currentChar = this._sourceText[this._state.currentPosition.absoluteIndex];
      this._state.currentPosition.absoluteIndex += 1;
    } else {
      this._state.currentChar = Scanner.END_OF_FILE
    }
  }

  /**
   * Reads the next token in the minimatica source text.
   */
  readToken(): void {
    // skip whitespace
    while (this._state.currentChar === ' ' ||
    this._state.currentChar === Scanner.TAB ||
    this._state.currentChar === Scanner.NEW_LINE) {
      this.readChar();
    }
    switch (this._state.currentChar) {
      case Scanner.END_OF_FILE:
        this._state.currentToken = Token.EndOfFile;
        break;
      case ':':
        this.readChar();
        // @ts-ignore "always false" bla bla
        if (this._state.currentChar === '=') {
          this._state.currentToken = Token.Assignment;
          this.readChar();
        } else {
          this._state.currentToken = Token.Error;
          this.onError(this._state.currentChar, this._state.currentPosition.line, this._state.currentPosition.column);
        }
        break;
      case '(':
        this._state.currentToken = Token.LeftPar;
        this.readChar();
        break;
      case ')':
        this._state.currentToken = Token.RightPar;
        this.readChar();
        break;
      case ',':
        this._state.currentToken = Token.Comma;
        this.readChar();
        break;
      case '[':
        this._state.currentToken = Token.CaptureBegin;
        this.readChar();
        break;
      case ']':
        this._state.currentToken = Token.CaptureEnd;
        this.readChar();
        break;
      case '<':
        this._state.currentToken = Token.GenericBegin;
        this.readChar();
        break;
      case '>':
        this._state.currentToken = Token.GenericEnd;
        this.readChar();
        break;
      case ';':
        this._state.currentToken = Token.StatementTerminator;
        this.readChar();
        break;
      case '^':
        this._state.currentToken = Token.Exponential;
        this.readChar();
        break;
      case '+':
        this._state.currentToken = Token.Addition;
        this.readChar();
        break;
      case '-':
        this.readChar();
        // @ts-ignore
        if (this._state.currentChar === '>') {
          this._state.currentToken = Token.LambdaArrow;
          this.readChar();
        } else {
          this._state.currentToken = Token.Subtraction;
        }
        break;
      case '*':
        this._state.currentToken = Token.Multiplication;
        this.readChar();
        break;
      case '/':
        this._state.currentToken = Token.Division;
        this.readChar();
        break;
      case '%':
        this._state.currentToken = Token.Modulo;
        this.readChar();
        break;
      case '#':
        // # starts a comment, read until EOL
        // @ts-ignore
        while (this._state.currentChar !== Scanner.NEW_LINE && this._state.currentChar !== Scanner.END_OF_FILE) {
          this.readChar();
        }
        // @ts-ignore
        if (this._state.currentChar === Scanner.END_OF_FILE) {
          this._state.currentToken = Token.EndOfFile;
        }
        this.readToken();
        break;
      default:
        // Scan Identifiers and numbers
        if (isAlpha(this._state.currentChar)) {
          this.readIdentifier();
        } else if (isDigit(this._state.currentChar)) {
          this.readNumber();
        } else {
          this._state.currentToken = Token.Error;
          this.onError(this._state.currentChar, this._state.currentPosition.line, this._state.currentPosition.column);
        }
    }
  }

  lookAhead(): Token {
    // If minimatica evolves to a LL(*) grammar,
    // this can easily be transformed to look ahead
    // x tokens.
    let la: Token = Token.Error;
    const storedState: ScannerState = this.freezeState();
    this.readToken();
    la = this.getCurrentToken();
    this.setState(storedState);
    return la;
  }

  private freezeState(): ScannerState {
    const frozenTextPosition: TextPosition = {
      absoluteIndex: this._state.currentPosition.absoluteIndex,
      column: this._state.currentPosition.column,
      line: this._state.currentPosition.line
    };
    return <ScannerState>{
      currentChar: this._state.currentChar,
      currentPosition: frozenTextPosition,
      currentToken: this._state.currentToken,
      literalBuffer: this._state.literalBuffer
    };
  }
  
  private setState(state: ScannerState) {
    this._state = state;
  }

  /**
   * Scans the minimatica source text from the current
   * text position until the end of an identifier.
   * The scanned identifier can be retrieved using
   * {@link getIdentifier}().
   */
  private readIdentifier(): void {
    this._state.literalBuffer = this._state.currentChar;
    this.readChar();
    while (isAlpha(this._state.currentChar) || isDigit(this._state.currentChar) || this._state.currentChar === '_') {
      this._state.literalBuffer += this._state.currentChar;
      this.readChar();
    }

    if (this._state.literalBuffer === 'var') {
      this._state.currentToken = Token.Var;
    } else {
      this._state.currentToken = Token.Identifier;
    }
  }

  /**
   * Scans the minimatica source text from the current
   * text position until the end of a number.
   * The scanned number can be retrieved using
   * {@link getNumber}().
   */
  private readNumber(): void {
    this._state.currentToken = Token.Number;
    this._state.literalBuffer = this._state.currentChar;
    this.readChar();
    while (isDigit(this._state.currentChar)) {
      this._state.literalBuffer += this._state.currentChar;
      this.readChar();
    }
    if (this._state.currentChar === '.') {
      this._state.literalBuffer += '.';
      this.readChar();
      while (isDigit(this._state.currentChar)) {
        this._state.literalBuffer += this._state.currentChar;
        this.readChar();
      }
    }
  }

  /**
   * @return The most recently found token.
   */
  getCurrentToken(): Token {
    return this._state.currentToken;
  }

  /**
   * @return The most recently found identifier.
   */
  getIdentifier(): string {
    return this._state.literalBuffer;
  }

  /**
   * @return The most recently found number.
   * @throws If the value returned from the scanner
   *          is NaN.
   */
  getNumber(): number {
    const value = parseFloat(this._state.literalBuffer);
    if (isNaN(value)) {
      throw new Error('Scanned value is not a number!');
    }
    return value;
  }
}