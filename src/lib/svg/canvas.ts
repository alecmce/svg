import { Entity, Watch, Resolve } from '../powder/powder';
import { Proxy } from './proxy';

@Entity
export class Canvas {
  readonly element: SVGSVGElement;
  private readonly past = new Set<Proxy<any>>();

  @Watch readonly children: Proxy<any>[];

  constructor(
    element: SVGSVGElement,
  ) {
    this.element = element;
  }

  @Resolve
  resolve() {
    const future = new Set<Proxy<any>>();
    this.appendChildren(future);
    this.removeChildren(this.past, future);
  }

  private appendChildren(future: Set<Proxy<any>>) {
    this.children.forEach(child => {
      future.add(child);
      if (!this.past.has(child)) this.element.appendChild(child.element);
    });
  }

  private removeChildren(past: Set<Proxy<any>>, future: Set<Proxy<any>>) {
    const missing = new Set<Proxy<any>>(this.past);
    future.forEach(child => missing.delete(child));
    missing.forEach(child => {
      this.past.delete(child);
      this.element.removeChild(child.element);
    });
  }
}
