import { DependencyGraph } from './dependency_graph';

describe('Dependencies', () => {
  let onRemoved: jasmine.Spy;
  let instance: DependencyGraph<string>;
  beforeEach(() => {
    onRemoved = jasmine.createSpy('onRemoved');
    instance = new DependencyGraph<string>(onRemoved);
  });

  it('removes a dependency when what depends on it is removed', () => {
    instance.addNode('foo');
    instance.addEdge('foo', 'bar');
    instance.removeNode('foo');
    expect(onRemoved).toHaveBeenCalledWith('bar');
  });

  it('does not remove a dependency that is independently added', () => {
    instance.addNode('foo');
    instance.addEdge('foo', 'bar');
    instance.addNode('bar');
    instance.removeNode('foo');
    expect(onRemoved).not.toHaveBeenCalledWith('bar');
  });

  it('removes a node that is transitively added when the transitive chain breaks', () => {
    instance.addNode('foo');
    instance.addEdge('foo', 'bar');
    instance.addEdge('bar', 'baz');
    instance.removeNode('foo');
    expect(onRemoved).toHaveBeenCalledWith('baz');
  });

  it('does not remove a node when one of several dependencies is removed', () => {
    instance.addNode('foo');
    instance.addNode('bar');
    instance.addEdge('foo', 'baz');
    instance.addEdge('bar', 'baz');
    instance.removeNode('foo');
    expect(onRemoved).not.toHaveBeenCalledWith('baz');
  });
});
