import { Entity } from './entity';
import { Observer } from './observer';

/**
 * Uses a depth-first search to update entities that have changed, or have
 * dependencies that have changed.
 *
 * When an entity is found that is not a member of the given observers,
 * it will be resolved as a member of the dependency graph, but will not be
 * added to the input map. This will cause unnecessary overhead.
 *
 * Updater will throw an error in the case that the entities provided form
 * a cyclic graph.
 */
export class Updater {
  static NON_DAG_ERROR = 'Cyclical Dependency Graphs are not supported';

  private readonly flags = new Map<Observer, Flag>();
  private readonly temporary = new Map<Entity, Observer>();
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
    const observer = this.observers.get(entity) || this.getTemporary(entity);
    return this.resolve(observer, this.flags.get(observer));
  }

  private getTemporary(entity: Entity): Observer {
    return this.temporary.has(entity) ?
      this.temporary.get(entity) :
      this.temporary.set(entity, new Observer(entity, true)).get(entity);
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