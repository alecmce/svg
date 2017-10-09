import { Entity } from './entity';
import { Observer, Observers } from './observer';

describe('Observer', () => {
  let entity: Entity;
  let observer: Observer;
  beforeEach(() => {
    entity = { x: 10, update: jasmine.createSpy('update') };
    observer = new Observer(entity);
  });

  it('considers the subject unchanged at construction', () => {
    expect(observer.isChanged()).toBe(false);
  });

  it('considers the subject changed if a value is mutated', () => {
    entity.x = 20
    expect(observer.isChanged()).toBe(true);
  });

  it('resets isChanged on update', () => {
    entity.x = 20;
    observer.update();
    expect(observer.isChanged()).toBe(false);
  });

  it('does not call update automatically', () => {
    expect(entity.update).not.toHaveBeenCalled();
  });

  it('calls update on model if defined', () => {
    observer.update();
    expect(entity.update).toHaveBeenCalled();
  });
});

describe('Observers', () => {
  let entity: Entity;
  let observers: Observers;
  beforeEach(() => {
    entity = { x: 10, update: jasmine.createSpy('update') };
    observers = new Observers();
  });

  it('returns an Observer for a model on add', () => {
    expect(observers.add(entity)).toEqual(jasmine.any(Observer));
  });

  it('returns the same Observer for the same model on repeated add', () => {
    expect(observers.add(entity)).toBe(observers.add(entity));
  });

  it('returns a new Observer if it was subsequently deleted', () => {
    const observer = observers.add(entity);
    observers.remove(entity);
    expect(observers.add(entity)).not.toBe(observer);
  });

  it('returns an Observer for a model on get if added', () => {
    expect(observers.add(entity)).toBe(observers.get(entity));
  });

  it('returns undefined on get if not added', () => {
    expect(observers.get(entity)).not.toBeDefined();
  });

  it('updates observers when they have changed', () => {
    observers.add(entity);
    entity.x = 20;
    observers.update();
    expect(entity.update).toHaveBeenCalled();
  });

  it('updates observers when dependency models are changed', () => {
    const depender = { dep: entity, update: jasmine.createSpy('update') };
    observers.add(depender);
    entity.x = 20;
    observers.update();
    expect(entity.update).toHaveBeenCalled();
    expect(depender.update).toHaveBeenCalled();
  });

  it('updates observers recursively ', () => {
    const middle = { dep: entity, update: jasmine.createSpy('update') };
    const depender = { dep: middle, update: jasmine.createSpy('update') };
    observers.add(depender);
    entity.x = 20;
    observers.update();
    expect(entity.update).toHaveBeenCalled();
    expect(middle.update).toHaveBeenCalled();
    expect(depender.update).toHaveBeenCalled();
  });

  it('only updates dependencies once', () => {
    const first = { dep: entity, update: jasmine.createSpy('update') };
    const second = { dep: entity, update: jasmine.createSpy('update') };
    observers.add(first);
    observers.add(second);
    entity.x = 20;
    observers.update();
    expect(first.update).toHaveBeenCalled();
    expect(second.update).toHaveBeenCalled();
    expect((entity.update as jasmine.Spy).calls.count()).toEqual(1);
  });

  it('throws an error if there is a cyclic dependency graph', () => {
    const first = { dep: entity, alt: entity, update: jasmine.createSpy('udpate') };
    const second = { dep: first, update: jasmine.createSpy('udpate') };
    first.alt = second;
    entity.x = 20;
    observers.add(first);
    expect(() => observers.update()).toThrow(new Error('Cyclical Dependency Graphs are not supported'));
  });
});