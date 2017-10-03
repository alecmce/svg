export interface Handler<T> {
  (data: T): void;
}

class HandlerProxy<T> {
  constructor(
    readonly handler: Handler<T>,
    readonly isOnceOnly: boolean,
  ) { }
}

export class Signal<T> {
  private list: HandlerProxy<T>[] = [];

  add(handler: Handler<T>): () => boolean {
    return this.addProxy(handler, false);
  }

  addOnce(handler: Handler<T>): () => boolean {
    return this.addProxy(handler, true);
  }

  private addProxy(handler: Handler<T>, isOnceOnly: boolean): () => boolean {
    if (!this.getProxy(handler)) {
      this.list.push(new HandlerProxy(handler, isOnceOnly));
    }
    return () => this.remove(handler);
  }

  private getProxy(handler: Handler<T>): HandlerProxy<T> {
    return this.list.find(p => p.handler === handler);
  }

  remove(handler: Handler<T>): boolean {
    const proxy = this.getProxy(handler);
    if (proxy) {
      this.list = this.list.filter(p => p !== proxy);
    }
    return !!proxy;
  }

  removeAll(): void {
    this.list.length = 0;
  }

  emit(data: T = undefined): void {
    const list = this.list.concat();
    this.list = this.list.filter(p => !p.isOnceOnly);
    list.forEach(p => p.handler(data));
  }
}
