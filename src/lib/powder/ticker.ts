import { update, isEntity, EntityInstance } from './entity';

export class Ticker {
  private isRunning = true;
  private readonly entities = new Set<EntityInstance>();
  private readonly tick = () => this.iterate();
  constructor() {
    requestAnimationFrame(this.tick);
  }

  add(entity: any): void {
    if (isEntity(entity)) this.entities.add(entity);
  }

  remove(entity: any) {
    this.entities.delete(entity);
  }

  private iterate() {
    for (let entity of this.entities) update(entity);
    if (this.isRunning) requestAnimationFrame(this.tick);
  }

  start() {
    const isRunning = this.isRunning;
    this.isRunning = true;
    if (!isRunning) requestAnimationFrame(this.tick);
  }

  stop() {
    this.isRunning = false;
  }
}