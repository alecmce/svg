import { Entity, isEntity, Value, isValue } from './entity';

/**
 * An Observer traverses an entity and records its state so that
 * changes in values are detected. isChanged() returns whether a
 * value has changed since construction or the last update().
 *
 * Observer will also detect Entities on which the Entity depends.
 * This is used in Observers to automatically update entities
 */
export class Observer {
  readonly deps: Array<Entity | Entity[]>;

  private readonly keys: string[];
  private readonly values: { [key: string]: Value } = {};
  constructor(
    readonly model: Entity,
    private isChangedFlag = false,
  ) {
    const keys = getKeys(model);
    this.deps = getDeps(model, keys);
    this.keys = getValueKeys(model, keys);
    this.cacheValues();
  }

  isChanged() {
    return this.isChangedFlag || (this.isChangedFlag = this.isValueDiscrepancy());
  }

  update() {
    this.cacheValues();
    this.isChangedFlag = false;
    this.model.update();
  }

  private cacheValues() {
    this.keys.forEach(key => this.values[key] = this.model[key]);
  }

  private isValueDiscrepancy(): boolean {
    return this.keys.some(key => this.values[key] !== this.model[key]);
  }
}

function getKeys(model: Entity): string[] {
  const keys: string[] = [];
  for (const key in model) keys.push(key);
  return keys;
}

function getDeps(model: Entity, keys: string[]): Entity[] {
  return keys.map(key => model[key]).filter(isEntity);
}

function getValueKeys(model: Entity, keys: string[]): string[] {
  return keys.filter(key => isValue(model[key]));
}
