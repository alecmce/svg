export interface Lerp {
  update(p: number): void;
}

export class ObjectLerp<T> implements Lerp {
  private readonly lerps: ValueLerp<T>[] = [];
  constructor(
    subject: T,
    target: Partial<T>,
  ) {
    for (let key in target) {
      const type = typeof subject[key];
      if (type == typeof target[key]) {
        if (typeof subject[key] == 'number') {
          this.lerps.push(new NumberLerp(subject, key, target[key]));
        }
      }
    }
  }

  update(p: number) {
    this.lerps.forEach(lerp => lerp.update(p));
  }
}

export abstract class ValueLerp<T> implements Lerp {
  constructor(
    readonly subject: T,
    readonly key: keyof T,
  ) { }

  abstract update(p: number): void;
}

export class NumberLerp<T> extends ValueLerp<T> {
  private initial: number;
  private delta: number;
  constructor(
    readonly subject: T,
    readonly key: keyof T,
    readonly target: T[keyof T],
  ) {
    super(subject, key);
    this.initial = subject[key] as any as number;
    this.delta = target as any as number - this.initial;
  }

  update(p: number) {
    this.subject[this.key] = this.getValue(p);
  }

  getValue(p: number): any {
    return this.initial + p * this.delta;
  }
}
