/**
 * A log function takes an object and is free
 * to return whatever it wants.
 */
interface LogFunction {
  (obj: any): any;
}

/**
 * An error function takes a string and is free
 * to return whatever it wants.
 */
interface ErrorFunction {
  (msg: string): any;
}

/**
 * A logging abstraction which can be used for logging objects
 * or issuing errors.
 */
export class Console {

  /**
   * The list of logged objects.
   */
  readonly logs: any[];

  /**
   * The list of issued errors.
   */
  readonly errors: string[];

  /**
   * The callback for logging ordinary messages.
   */
  onLog: LogFunction;

  /**
   * The callback for issuing errors.
   */
  onError: ErrorFunction;

  constructor() {
    this.logs = [];
    this.errors = [];
    this.onLog = (obj: any) => {
      console.log(obj.toString());
    };
    this.onError = console.error;
  }

  /**
   * Logs all objects to the console (separately).
   * @param objs The objects to log.
   */
  log(...objs: any): void {
    const self = this;
    objs.forEach((obj: any) => {
      self.logs.push(obj);
      self.onLog(obj);
    });
  }

  /**
   * Issues an error.
   * @param msg The message to include.
   */
  error(msg: string): void {
    this.errors.push(msg);
    this.onError(msg);
  }

  /**
   * Clears all logs and errors.
   */
  clear(): void {
    while (this.logs.length > 0) {
      this.logs.pop();
    }
    while (this.errors.length > 0) {
      this.errors.pop();
    }
  }
}