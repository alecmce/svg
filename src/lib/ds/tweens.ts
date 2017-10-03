import { Lerp, ObjectLerp } from './lerp';

const DEFAULT_EASE = (p: number) => p;

export interface Ease {
  (p: number): number;
}

export interface TweenConfig {
  duration: number;
  delay?: number;
  ease?: Ease;
}

export class Tweens {
  private isRunning = false;
  private now: number;
  private delegates: TweenDelegate[] = [];
  private readonly update = () => this.updateDelegates();

  constructor(readonly refresh: () => void) { }

  tween<T>(subject: T, props: Partial<T>, durationOrConfig: number | TweenConfig): this {
    if (!this.isRunning) this.start();
    this.addDelegate(subject, props, durationOrConfig);
    return this;
  }

  private start() {
    this.isRunning = true;
    this.now = new Date().valueOf();
    requestAnimationFrame(this.update);
  }

  private updateDelegates() {
    this.now = new Date().valueOf();
    this.delegates.forEach(d => d.update(this.now));
    this.refresh();
    this.delegates = this.delegates.filter(d => !d.isComplete);
    this.isRunning = this.delegates.length > 0;
    if (this.isRunning) requestAnimationFrame(this.update);
  }

  private addDelegate<T>(subject: T, props: Partial<T>, durationOrConfig: number | TweenConfig) {
    const lerp = new ObjectLerp(subject, props);
    const delegate = new TweenDelegate(lerp, this.now, durationOrConfig);
    this.delegates.push(delegate);
  }
}

class TweenDelegate {
  isComplete = false;
  readonly start: number;
  readonly duration: number;
  readonly ease: Ease;
  constructor(
    readonly lerp: Lerp,
    now: number,
    durationOrConfig: number | TweenConfig,
  ) {
    const isConfig = typeof durationOrConfig == 'object';
    this.start = now + (isConfig ? (durationOrConfig as TweenConfig).delay || 0 : 0);
    this.duration = isConfig ? (durationOrConfig as TweenConfig).duration : durationOrConfig as number;
    this.ease = isConfig ? (durationOrConfig as TweenConfig).ease || DEFAULT_EASE : DEFAULT_EASE;
  }

  update(time: number) {
    const p = this.getPercentage(time);
    this.isComplete = p == 1;
    this.lerp.update(this.ease(p));
  }

  private getPercentage(time: number): number {
    if (time <= this.start)
      return 0;
    else if (time >= this.start + this.duration)
      return 1;
    else
      return (time - this.start) / this.duration;
  }
}