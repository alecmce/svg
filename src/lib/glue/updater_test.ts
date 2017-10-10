import { Entity } from './entity';
import { Observer } from './observer';
import { Updater } from './updater';

describe('Updater', () => {
  let entity: Entity;
  let observers: Map<Entity, Observer>;
  beforeEach(() => {
    entity = { x: 10, update: jasmine.createSpy('update') };
    observers = new Map<Entity, Observer>();
  });

  it('updates observers when they have changed', () => {
    observers.set(entity, new Observer(entity));
    entity.x = 20;
    new Updater(observers);
    expect(entity.update).toHaveBeenCalled();
  });

  it('updates observers when dependency models are changed', () => {
    const depender = { dep: entity, update: jasmine.createSpy('update') };
    observers.set(depender, new Observer(depender));
    entity.x = 20;
    new Updater(observers);
    expect(entity.update).toHaveBeenCalled();
    expect(depender.update).toHaveBeenCalled();
  });

  it('does not mutate the underlying observers', () => {
    const depender = { dep: entity, update: jasmine.createSpy('update') };
    observers.set(depender, new Observer(depender));
    entity.x = 20;
    new Updater(observers);
    expect(observers.get(entity)).not.toBeDefined();
  });

  it('updates observers recursively ', () => {
    const middle = { dep: entity, update: jasmine.createSpy('update') };
    const depender = { dep: middle, update: jasmine.createSpy('update') };
    observers.set(depender, new Observer(depender));
    entity.x = 20;
    new Updater(observers);
    expect(entity.update).toHaveBeenCalled();
    expect(middle.update).toHaveBeenCalled();
    expect(depender.update).toHaveBeenCalled();
  });

  it('only updates dependencies once', () => {
    const first = { dep: entity, update: jasmine.createSpy('update') };
    const second = { dep: entity, update: jasmine.createSpy('update') };
    observers.set(first, new Observer(first));
    observers.set(second, new Observer(second));
    entity.x = 20;
    new Updater(observers);
    expect(first.update).toHaveBeenCalled();
    expect(second.update).toHaveBeenCalled();
    expect((entity.update as jasmine.Spy).calls.count()).toEqual(1);
  });

  it('throws an error if there is a cyclic dependency graph', () => {
    const first = { dep: entity, alt: entity, update: jasmine.createSpy('update') };
    const second = { dep: first, update: jasmine.createSpy('update') };
    first.alt = second;
    entity.x = 20;
    observers.set(first, new Observer(first));
    expect(() => new Updater(observers)).toThrow(new Error('Cyclical Dependency Graphs are not supported'));
  });
});