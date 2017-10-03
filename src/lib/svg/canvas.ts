import { Container } from '../ds/container';
import { Proxy } from './interfaces';
import { Signal } from '../ds/signal';

export class Canvas implements Container {
  readonly resize = new Signal<void>();

  readonly children = new Map<Proxy<any>, ChildData>();
  constructor(private readonly element: SVGSVGElement) {
    window.onresize = () => this.resize.emit();
  }

  append(child: Proxy<any>) {
    if (!this.children.has(child)) this.children.set(child, new ChildData());
  }

  remove(child: Proxy<any>) {
    if (this.children.has(child)) this.children.get(child).isDeleted = true;
  }

  update(): void {
    this.children.forEach((data, child) => this.updateChild(child, data));
  }

  private updateChild(child: Proxy<any>, data: ChildData) {
    data.isDeleted ?
      this.removeElementAndDeleteReference(child, data) :
      this.updateAndAppendElementIfCreated(child, data);
  }

  private removeElementAndDeleteReference(child: Proxy<any>, data: ChildData) {
    if (data.element) this.element.removeChild(data.element);
    this.children.delete(child);
  }

  private updateAndAppendElementIfCreated(child: Proxy<any>, data: ChildData) {
    const e = child.update(data.element);
    if (!data.element) {
      this.element.appendChild(e);
      data.element = e;
    }
  }
}

class ChildData {
  public element: SVGElement;
  public isDeleted = false;
}