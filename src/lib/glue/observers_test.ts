import { Entity } from './entity';
import { Observer } from './observer';
import { Observers } from './observers';
import { Updater } from './updater';

describe('Observers', () => {
  let entity: Entity;
  let updater: Updater;
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

  it('recursively adds a dependency entity', () => {
    const depender = { dep: entity, update: jasmine.createSpy('update') };
    observers.add(depender);
    expect(observers.get(entity)).toEqual(jasmine.any(Observer));
  });

  it('removes recursively added observer when the depender is added', () => {
    const depender = { dep: entity, update: jasmine.createSpy('update') };
    observers.add(depender);
    observers.remove(depender);
    expect(observers.get(entity)).not.toBeDefined();
  });
});