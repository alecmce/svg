export function make<T extends SVGElement>(type: string): T {
  return document.createElementNS('http://www.w3.org/2000/svg', type) as T;
}