export class Ticker {
  private isRunning = true;
  private readonly updates = new Set<() => {}>();
  private readonly tick = () => this.iterate();
  constructor() {
    requestAnimationFrame(this.tick);
  }

  add(update: () => {}): void {
    this.updates.add(update);
  }

  remove(update: () => {}) {
    this.updates.delete(update);
  }

  private iterate() {
    for (let update of this.updates) update();
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