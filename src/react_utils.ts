export function withOptionalStyles(main: string, ...optionals): string {
  return [main, ...optionals].join(" ");
}