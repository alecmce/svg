export class Ticker {
  private isRunning = true;
  private readonly tick = () => this.iterate();
  constructor(private readonly update: () => void) {
    requestAnimationFrame(this.tick);
  }

  private iterate() {
    this.update();
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