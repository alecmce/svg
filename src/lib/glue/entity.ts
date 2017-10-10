export interface Entity {
  [key: string]: any;
  update: () => void;
}

export function isEntity(object: any): object is Entity {
  return object instanceof Object && 'update' in object && object.update instanceof Function;
}

export type Value = number | string | boolean;

export function isValue(object: any): object is Value {
  const type = typeof object;
  return type === 'number' || type === 'string' || type === 'boolean';
}

export function isEntityList(object: any): object is Entity[] {
  const type = typeof object;
  return type === 'object' && object.length && object.every && (object as any[]).every(obj => isEntity(obj));
}

export function isEntityOrEntityList(object: any): object is Entity | Entity[] {
  return isEntity(object) || isEntityList(object);
}
