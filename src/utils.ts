/**
 * This is a helper function for react components which have
 * "conditional style classes" depending on their state.
 * @param main The main style class which needs to be included.
 * @param optionals Optional style classes which are only included
 *        if they are not empty.
 * @return A string containing all supplied styleclasses.
 */
export function withOptionalStyles(main: string, ...optionals): string {
  return [main, ...optionals].join(" ");
}

/**
 * A small storage abstraction for caching minimatica code on the client.
 */
export class MMStorage {

  private static readonly _LOCAL_STORAGE_KEY = "mm-source-code";

  /**
   * @return The locally stored code.
   * @throws If the local storage is empty or non-existent.
   */
  static loadSourceCodeFromCache = (): string => {
    const source = localStorage.getItem(MMStorage._LOCAL_STORAGE_KEY);
    if (source === null || source === "") {
      throw new Error("Local storage does not exist or is empty.");
    }
    return source;
  };

  /**
   * Stores the supplied source code locally.
   * @param sourceCode The code to store.
   */
  static cacheSourceCode = (sourceCode: string): void => {
    localStorage.setItem(MMStorage._LOCAL_STORAGE_KEY, sourceCode);
  };
}