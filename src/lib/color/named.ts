import { Color } from './color';

export class NamedColor implements Color {
  constructor(readonly name: string) { }

  toString(): string {
    return this.name;
  }
}
