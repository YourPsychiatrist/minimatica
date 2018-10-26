export interface Callable {
  apply(arg: any): any;
}

export function asCallable(f: any) {
  if (typeof f === "function") {
    return f;
  } else if (typeof f.apply === "function") {
    return f.apply.bind(f);
  } else {
    throw new Error("Supplied argument cannot be made callable!");
  }
}