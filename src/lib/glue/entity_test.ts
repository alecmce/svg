import { isEntity, isEntityList, isValue } from './entity';

describe('isEntity', () => {
  it('is true for entities', () => {
    const entity = { x: 10, update: () => { } };
    expect(isEntity(entity)).toBe(true);
  });

  it('is false for objecsts without an update function', () => {
    const entity = { x: 10 };
    expect(isEntity(entity)).toBe(false);
  });

  it('is false for strings', () => expect(isEntity('value')).toBe(false));
  it('is false for numbers', () => expect(isEntity(3)).toBe(false));
  it('is false for boolean', () => expect(isEntity(false)).toBe(false));
  it('is false for empty lists', () => expect(isEntity([])).toBe(false));

  it('is false for lists of entities', () => {
    const entity = { x: 10, update: () => { } };
    expect(isEntity([entity])).toBe(false);
  });
});

describe('isValue', () => {
  it('is true for strings', () => expect(isValue('value')).toBe(true));
  it('is true for numbers', () => expect(isValue(3)).toBe(true));
  it('is true for boolean', () => expect(isValue(true)).toBe(true));
  it('is false for objects', () => expect(isValue({})).toBe(false));
  it('is false for empty lists', () => expect(isValue([])).toBe(false));

  it('is false for lists of entities', () => {
    const entity = { x: 10, update: () => { } };
    expect(isEntity([entity])).toBe(false);
  });
});

describe('isEntityList', () => {
  it('is true for strings', () => expect(isEntityList('value')).toBe(false));
  it('is true for numbers', () => expect(isEntityList(3)).toBe(false));
  it('is true for boolean', () => expect(isEntityList(true)).toBe(false));
  it('is false for objects', () => expect(isEntityList({})).toBe(false));
  it('is false for empty lists', () => expect(isEntityList([])).toBe(false));

  it('is true for lists of entities', () => {
    const entity = { x: 10, update: () => { } };
    expect(isEntityList([entity])).toBe(true);
  });
});
