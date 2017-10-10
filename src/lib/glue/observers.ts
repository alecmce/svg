import { DependencyGraph } from './dependency_graph';
import { Entity } from './entity';
import { Observer } from './observer';
import { Updater } from './updater';

/**
 * Maintains a collection of Observers. When an entity is added to
 * the collection, its dependencies are recursively added.
 */
export class Observers {
  private readonly map = new Map<Entity, Observer>();
  private readonly onRemoved = (entity: Entity) => this.remove(entity);
  private dependencyGraph = new DependencyGraph<Entity>(this.onRemoved);

  add(entity: Entity): Observer {
    const observer = this.addToMap(entity);
    this.dependencyGraph.addNode(entity);
    return observer;
  }

  private addToMap(entity: Entity): Observer {
    return this.map.has(entity) ?
      this.map.get(entity) :
      this.makeObserver(entity);
  }

  private makeObserver(entity: Entity): Observer {
    const observer = new Observer(entity);
    this.map.set(entity, observer);
    observer.deps.forEach(dep => this.addDependency(entity, dep));
    return observer;
  }

  private addDependency(entity: Entity, dependsOn: Entity) {
    this.dependencyGraph.addEdge(entity, dependsOn);
    this.addToMap(dependsOn);
  }

  get(entity: Entity): Observer {
    return this.map.get(entity);
  }

  remove(entity: Entity) {
    this.map.delete(entity);
    this.dependencyGraph.removeNode(entity);
  }

  update() {
    new Updater(this.map);
  }

  private updateIfChanged(observer: Observer) {
    if (observer.isChanged()) observer.update();
  }
}
