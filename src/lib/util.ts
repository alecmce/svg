export function repeat<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({length: count}).map((_, i) => factory(i));
}

export interface Create<A, B> {
  (input: A): B;
}

export interface Update<A, B> {
  (input: A, output: B): void;
}

export class Sync<A, B> {
  constructor(
    readonly create: Create<A, B>,
    readonly update: Update<A, B>,
  ) {}

  apply(input: A[], output: B[]) {
    const howManyInputData = input.length;
    const howManyOutputData = output.length;
    const delta = howManyOutputData - howManyInputData;

    output.slice(0, howManyOutputData).forEach((b, i) => this.update(input[i], b));
    if (delta > 0) {
      output.length = howManyInputData;
    } else if (delta < 0) {
      output.push(...input.slice(howManyOutputData).map(this.create));
    } 
  }
}