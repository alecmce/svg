export function repeat<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }).map((_, i) => factory(i));
}
