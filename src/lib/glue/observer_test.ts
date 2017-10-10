import { Entity } from './entity';
import { Observer } from './observer';

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

  it('records an entity as a dep', () => {
    const other = new Observer({ entity, update: jasmine.createSpy('update') });
    expect(other.deps).toContain(entity);
  });
});
