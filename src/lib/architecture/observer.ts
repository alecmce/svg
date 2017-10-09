import { Entity, isEntity, Value, isValue } from './entity';

const UPDATE = 'update';

export class Observer {
  public readonly deps: Entity[];
  private readonly keys: string[];
  private readonly values: { [key: string]: Value } = {};
  constructor(readonly model: Entity) {
    const keys = getKeys(model);
    this.deps = getEntities(model, keys);
    this.keys = getValueKeys(model, keys);
    this.keys.forEach(key => this.values[key] = this.model[key]);
  }

  isChanged() {
    return this.keys.some(key => this.values[key] !== this.model[key]);
  }

  update() {
    this.keys.forEach(key => this.values[key] = this.model[key]);
    this.model.update();
  }
}

function getKeys(model: Entity): string[] {
  const keys: string[] = [];
  for (const key in model) keys.push(key);
  return keys;
}

function getEntities(model: Entity, keys: string[]): Entity[] {
  return keys.map(key => model[key]).filter(isEntity);
}

function getValueKeys(model: Entity, keys: string[]): string[] {
  return keys.filter(key => isValue(model[key]));
}

export class Observers {
  private map = new Map<Entity, Observer>();

  add(entity: Entity): Observer {
    return this.map.has(entity) ?
      this.map.get(entity) :
      this.makeObserver(entity);
  }

  private makeObserver(entity: Entity): Observer {
    const observer = new Observer(entity);
    this.map.set(entity, observer);
    observer.deps.forEach(dep => this.add(dep));
    return observer;
  }

  get(model: Entity): Observer {
    return this.map.get(model);
  }

  remove(model: Entity) {
    this.map.delete(model);
  }

  update() {
    new Updater(this.map);
  }

  private updateIfChanged(observer: Observer) {
    if (observer.isChanged()) observer.update();
  }
}

class Updater {
  static NON_DAG_ERROR = 'Cyclical Dependency Graphs are not supported';

  private readonly flags = new Map<Observer, Flag>();
  readonly log: string[] = [];
  constructor(readonly observers: Map<Entity, Observer>) {
    this.observers.forEach((observer, entity) => this.visit(entity, observer));
  }

  private visit(entity: Entity, observer: Observer): boolean {
    return this.resolve(observer, this.flags.get(observer));
  }

  private resolve(observer: Observer, flag: Flag): boolean {
    switch (flag) {
      case Flag.UPDATED: return true;
      case Flag.VISITED: return false;
      case Flag.TEMPORARY: throw new Error(Updater.NON_DAG_ERROR);
      default: return this.visitNode(observer);
    }
  }

  private visitNode(observer: Observer): boolean {
    this.flags.set(observer, Flag.TEMPORARY);
    const isDepUpdated = this.visitDependencies(observer);
    const isUpdated = this.update(observer, isDepUpdated);
    this.updateFlag(observer, isUpdated);
    return isUpdated;
  }

  private visitDependencies(observer: Observer): boolean {
    return observer.deps
      .map(dep => this.visitDependency(dep))
      .some(v => v);
  }

  private visitDependency(entity: Entity): boolean {
    const observer = this.observers.get(entity);
    return observer && this.resolve(observer, this.flags.get(observer));
  }

  private update(observer: Observer, isDepUpdated: boolean): boolean {
    const isUpdated = isDepUpdated || observer.isChanged();
    if (isUpdated) observer.update();
    return isUpdated;
  }

  private updateFlag(observer: Observer, isUpdated: boolean) {
    this.flags.set(observer, isUpdated ? Flag.UPDATED : Flag.VISITED);
  }
}

enum Flag {
  DEFAULT = 0,
  TEMPORARY,
  VISITED,
  UPDATED,
}
