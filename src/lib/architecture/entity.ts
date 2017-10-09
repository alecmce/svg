export interface Entity {
  [key: string]: any;
  update: () => void;
}

export function isEntity(object: any): object is Entity {
  return object instanceof Object && 'update' in object && object.update instanceof Function;
}

export type Value = number | string | boolean;

export function isValue(value: any): value is Value {
  const type = typeof value;
  return type === 'number' || type === 'string' || type === 'boolean';
}