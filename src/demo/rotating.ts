import { Canvas } from '../lib/svg/canvas';
import { Line } from '../lib/svg/line';
import { Color } from '../lib/color/color';
import { Shape } from './shape';
import { TweenConfig } from '../lib/tween/tween';
import { Tweens } from '../lib/tween/tweens';
import { Back, Bounce, Circ, Quad } from '../lib/tween/ease';
import { XY, Point } from '../lib/ds/xy';
import { TemplateFactory, Template, controls, blob, square, pin, eye, pie, bullet } from './templates';
import { PathConfig } from '../lib/svg/path';
import { Updater } from './updater';

export interface FactoryConfig {
  factory: TemplateFactory,
  color: Color,
}

export interface RotatingConfig {
  center: XY,
  size: number,
  duration: number,
  delay: number,
  tweens: Tweens,
  tweenConfig: TweenConfig,
  factories: FactoryConfig[],
  strokeConfig: PathConfig,
  fillConfig: PathConfig,
}

export class Rotating {
  constructor(
    readonly canvas: Canvas,
    readonly config: RotatingConfig,
  ) {
    const template = blob(config.center, config.size);

    canvas.append(new Shape(
      config.fillConfig,
      template,
    ));

    new TweenController(
      config.factories,
      config,
      template,
    ).start(square);
  }
}

class TweenController {
  private readonly updater: Updater;
  private lastCalled: TemplateFactory;
  private queue: FactoryConfig[];
  constructor(
    readonly templates: FactoryConfig[],
    readonly config: RotatingConfig,
    readonly template: Template,
  ) {
    this.updater = new Updater(config.tweens, config.tweenConfig, template);
    this.queue = shuffle(templates);
  }

  start(factory: TemplateFactory): this {
    this.lastCalled = factory;
    this.tweenShape(factory);
    setInterval(() => this.iterate(), this.config.duration + this.config.delay);
    return this;
  }

  private iterate() {
    const { factory, color } = this.getFactory();
    factory && this.tweenShape(factory);
    color && this.tweenColor(color);
    this.lastCalled = factory;
  }

  private getFactory(): FactoryConfig {
    if (!this.queue.length) this.queue = shuffle(this.templates);
    return this.queue.shift();
  }

  private tweenShape(fn: (center: XY, size: number) => Template) {
    const update = fn(this.config.center, this.config.size);
    this.updater.update(update);
  }

  private tweenColor(color: Color) {
    this.config.tweens.tween(
      this.config.fillConfig.fill,
      color,
      this.config.duration,
    );
  }
}

function shuffle<T>(list: T[]): T[] {
  const output: T[] = [];
  const input = list.concat();
  while (input.length) {
    const item = input.splice(Math.floor(Math.random() * input.length), 1)[0];
    output.push(item);
  }
  return output;
}