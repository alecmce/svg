import { Ease } from './ease';
import { Lerp, ObjectLerp } from './lerp';
import { Tween, TweenConfig } from './tween';

export class Tweens {
  private isRunning = false;
  private now: number;
  private delegates: Tween[] = [];
  private readonly update = () => this.updateTweens();

  constructor() { }

  tween<T>(subject: T, props: Partial<T>, durationOrConfig: number | TweenConfig): this {
    if (!this.isRunning) this.start();
    this.addTween(subject, props, durationOrConfig);
    return this;
  }

  private start() {
    this.isRunning = true;
    this.now = new Date().valueOf();
    requestAnimationFrame(this.update);
  }

  private updateTweens() {
    this.now = new Date().valueOf();
    this.delegates.forEach(d => d.update(this.now));
    this.delegates = this.delegates.filter(d => !d.isComplete);
    this.isRunning = this.delegates.length > 0;
    if (this.isRunning) requestAnimationFrame(this.update);
  }

  private addTween<T>(subject: T, props: Partial<T>, durationOrConfig: number | TweenConfig) {
    const lerp = new ObjectLerp(subject, props);
    const delegate = new Tween(lerp, this.now, durationOrConfig);
    this.delegates.push(delegate);
  }
}

