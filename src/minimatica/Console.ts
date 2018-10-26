import { Function } from "./StdLib/Function";

interface LogFunction {
  (obj: any): any;
}

interface ErrorFunction {
  (msg: string): any;
}

export class Console {

  readonly messages: any[];

  readonly errors: string[];

  onLog: LogFunction;

  onError: ErrorFunction;

  constructor() {
    this.messages = [];
    this.errors = [];
    this.onLog = (obj: any) => { console.log(obj.toString()) };
    this.onError = console.error;
  }

  log(...objs: any): void {
    const self = this;
    objs.forEach((obj: any) => {
      self.messages.push(obj);
      self.onLog(obj);
    });
  }

  error(msg: string): void {
    this.errors.push(msg);
    this.onError(msg);
  }

  clear(): void {
    while (this.messages.length > 0) {
      this.messages.pop();
    }
    while (this.errors.length > 0) {
      this.errors.pop();
    }
  }
}