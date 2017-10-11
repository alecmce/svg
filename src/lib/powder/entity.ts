import 'reflect-metadata';

/** Updates the object passed in, if it's an @Entity. */
export function update(entity: any) {
  if (entity.__isChanged && entity.__update && entity.__isChanged()) {
    entity.__update();
  }
}

/** Returns whether the object passed in is a changed @Entity. */
export function isChanged(entity: any): boolean {
  return entity.__isChanged && entity.__isChanged();
}

/**
 * Decorates an @Entity's property to be watched, so that changes are
 * detected.
 */
export function Watch(target: any, key: string, parameterIndex = -1) {
  if (!target.__watches) target.__watches = [];
  target.__watches.push(new WatchInstance(target, key));
}

/**
 * Decorates an @Entity with resolve function that is called on update.
 */
export function Resolve(target: any, key: string, descriptor: any) {
  if (!target.__resolves) target.__resolves = [];
  target.__resolves.push(key);
}

export interface EntityInstance {
  __resolves: Array<() => {}>
  __isChanged(): boolean;
  __update(): void;
}

/** Defines that the class is an @Entity. */
export function Entity<T extends { new(...args: any[]): {} }>(Class: T) {
  return class extends Class implements EntityInstance {
    readonly __isEntity = true;
    __watches: WatchInstance[];

    constructor(...args: any[]) {
      super(...args);
      this.__update();
    }

    __isChanged() {
      return this.__watches && this.__watches.some(w => w.isChanged());
    }

    __update() {
      this.__watches && this.__watches.forEach(w => w.update());
      if (this.__resolves) this.__resolves.forEach(key => this[key].apply(this));
    }
  }
}

/**
 * This was the only way that I was able to make this watch work. For reasons
 * that I don't understand, trying to simply watch the writable value on
 * object failed. Revisit this each time TypeScript updates, I guess!?
 */
class WatchInstance {
  private cached: any;
  private value: any;
  constructor(
    readonly object: any,
    readonly key: string,
  ) {
    Object.defineProperty(object, key, {
      get: () => this.value,
      set: (value) => this.value = value,
    });
  }

  isChanged() {
    return isIterable(this.value) ?
      this.hasIterableChanged() :
      isEntityChanged(this.value, this.cached);
  }

  private hasIterableChanged(): boolean {
    const iterator = (this.value as Iterable<any>)[Symbol.iterator]();
    let object = iterator.next(), i = 0;
    while (!object.done) {
      if (isEntityChanged(object.value, this.cached[i++])) return true;
      object = iterator.next();
    }
    return i !== this.cached.length;
  }

  update() {
    isIterable(this.value) ?
      this.updateIterable() :
      this.updateCached();
  }

  private updateIterable() {
    if (!this.cached) this.cached = [];
    updateIterable(this.value, this.cached);
  }

  private updateCached() {
    updateIfChangedEntity(this.cached);
    this.cached = this.value;
  }
}

/** Reports whether two values are different (or whether it's a changed entity) */
function isEntityChanged(value: any, cached: any): boolean {
  return value !== cached || isChangedEntity(value);
}

function updateIfChangedEntity(entity: any) {
  if (isChangedEntity(entity)) entity.__update();
}

/** Reports whether an object is a changed entity. */
function isChangedEntity(object: any): boolean {
  return object && object.__isEntity && object.__isChanged();
}

/** Reports whether an object is iterable. */
function isIterable(object: any): object is Iterable<any> {
  return object && typeof object[Symbol.iterator] === 'function';
}

function hasIterableChanged(value: Iterable<any>, cached: any[]) {
  const iterator = value[Symbol.iterator]();
  let object = iterator.next(), i = 0;
  while (!object.done) {
    if (isEntityChanged(object.value, cached[i++])) return true;
    object = iterator.next();
  }
  return i !== this.cached.length;
}

function updateIterable(value: Iterable<any>, cached: any[]) {
  const iterator = (value as Iterable<any>)[Symbol.iterator]();
  let object = iterator.next(), i = 0;
  while (!object.done) {
    updateIfChangedEntity(object.value);
    cached[i++] = object.value;
    object = iterator.next();
  }
}