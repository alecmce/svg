export class DependencyGraph<T> {
  private readonly roots = new Set<T>();
  private readonly deps = new Map<T, Set<T>>();

  constructor(private readonly onRemoved: (node: T) => void) { }

  addNode(node: T) {
    this.roots.add(node);
  }

  addEdge(node: T, hasDependency: T) {
    this.getDeps(hasDependency).add(node);
  }

  removeNode(node: T) {
    this.roots.delete(node);
    this.removeDeps(node);
  }

  private getDeps(node: T): Set<T> {
    return this.deps.has(node) ?
      this.deps.get(node) :
      this.deps.set(node, new Set<T>()).get(node);
  }

  private removeDeps(node: T) {
    this.deps.forEach((set, key) => this.removeDep(set, key, node));
  }

  private removeDep(set: Set<T>, key: T, node: T) {
    set.delete(node);
    if (set.size === 0) this.deleteNode(key);
  }

  private deleteNode(node: T) {
    this.deps.delete(node);
    if (!this.roots.has(node)) this.onRemoved(node);
    this.removeDeps(node);
  }
}