import { isEntity, isValue } from './entity';

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
});

describe('isValue', () => {
  it('is true for strings', () => expect(isValue('value')).toBe(true));
  it('is true for numbers', () => expect(isValue(3)).toBe(true));
  it('is true for boolean', () => expect(isValue(true)).toBe(true));
  it('is false for objects', () => expect(isValue({})).toBe(false));
});
