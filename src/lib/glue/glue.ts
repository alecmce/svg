import { Entity } from './entity';
import { Ticker } from './ticker';
import { Observers } from './observers';

export class Glue {
  private readonly observers = new Observers();
  private readonly ticker = new Ticker(() => this.observers.update());

  add(entity: Entity) {
    this.observers.add(entity);
  }

  remove(entity: Entity) {
    this.observers.remove(entity);
  }

  start() {
    this.ticker.start();
  }

  stop() {
    this.ticker.stop();
  }
}