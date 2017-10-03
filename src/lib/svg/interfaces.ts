export interface Proxy<T extends SVGElement> {
  update(element?: T): T;
}