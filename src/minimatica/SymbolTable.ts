/**
 * A table which stores Minimatica objects by
 * an identifier and manages them.
 */
export class SymbolTable {

  /**
   * The container mapping strings to objects.
   */
  private _symbols: Map<string, any>;

  constructor() {
    this._symbols = new Map();
  }

  /**
   * @return A deep clone of the symbol table
   */
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

  /**
   * @param name The identifier to search for.
   * @return True if the symbol table manages an object
   *         referred to by the supplied name.
   */
  contains(name: string): boolean {
    return this._symbols.has(name);
  }

  /**
   * @param name The identifier of the object.
   * @return The object referred to by the supplied name.
   */
  valueOf(name: string): any {
    if (!this._symbols.has(name)) {
      return undefined;
    } else {
      return this._symbols.get(name);
    }
  }

  /**
   * Declares a variable with the supplied identifier,
   * settings it's value to null.
   * @param name The identifier of the variable to declare.
   */
  declare(name: string): void {
    this._symbols.set(name, null);
  }

  /**
   * Declares a variable with the supplied identifier and
   * immediately sets its value.
   * @param name The identifier for the object.
   * @param value The value of the variable.
   */
  define(name: string, value: any): void {
    this._symbols.set(name, value);
  }

}