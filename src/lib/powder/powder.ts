import { update, EntityInstance } from './entity';
import { Ticker } from './ticker';

export { Entity, Watch, Resolve } from './entity';

export class Powder {
  private readonly ticker = new Ticker();

  add(entity: any) {
    this.ticker.add(entity);
  }

  remove(entity: any) {
    this.ticker.remove(entity);
  }

  start() {
    this.ticker.start();
  }

  stop() {
    this.ticker.stop();
  }
}