import { Ease } from './ease';
import { Lerp } from './lerp';

export interface TweenConfig {
  duration: number;
  delay?: number;
  ease?: Ease;
}

const DEFAULT_EASE = (p: number) => p;

export class Tween {
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