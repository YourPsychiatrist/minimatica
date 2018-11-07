export class SymbolTable {

  private _symbols: Map<string, any>;

  constructor() {
    this._symbols = new Map();
  }

  clone(): SymbolTable {
    const table = new SymbolTable();
    let it = this._symbols.entries();
    let curr = it.next();
    while (!curr.done) {
      table._symbols.set(curr.value[0], curr.value[1]);
      curr = it.next();
    }
    return table;
  }

  contains(name: string): boolean {
    return this._symbols.has(name);
  }

  valueOf(name: string): any {
    if (!this._symbols.has(name)) {
      return undefined;
    } else {
      return this._symbols.get(name);
    }
  }

  declare(name: string): void {
    this._symbols.set(name, null);
  }

  define(name: string, value: any): void {
    this._symbols.set(name, value);
  }

}