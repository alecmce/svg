import { Canvas } from '../lib/svg/canvas';
import { Line } from '../lib/svg/line';
import { Color } from '../lib/color/color';
import { Shape } from './shape';
import { Tweens } from '../lib/tween/tweens';
import { TweenConfig } from '../lib/tween/tween';
import { Back, Bounce, Circ, Quad } from '../lib/tween/ease';
import { XY, Point } from '../lib/ds/xy';
import { TemplateFactory, Template, controls, blob, square, pin, eye, pie, bullet } from './templates';
import { PathConfig } from '../lib/svg/path';
import { Updater } from './updater';
import { Entity } from '../lib/glue';

export interface SimpleConfig {
  centers: XY[],
  size: number,
  tweens: Tweens,
  tweenConfig: TweenConfig,
  factories: TemplateFactory[],
  colors: Color[],
  strokeConfig: PathConfig,
}

export class Simple implements Entity {
  readonly updaters: Updater[];
  constructor(
    readonly canvas: Canvas,
    readonly config: SimpleConfig,
  ) {
    this.updaters = config.factories.map((factory, index) => this.makeUpdater(factory, index));
  }

  makeUpdater(factory: TemplateFactory, index: number): Updater {
    const template = factory(this.config.centers[index], this.config.size);
    const updater = new Updater(this.config.tweens, this.config.tweenConfig, template);
    this.makeShape({ fill: this.config.colors[index] }, updater);
    this.makeShape(this.config.strokeConfig, updater);
    return updater;
  }

  makeShape(config: PathConfig, updater: Updater) {
    this.canvas.append(new Shape(config, updater.template));
  }

  update() {
    this.updaters.forEach((updater, index) => {
      const factory = this.config.factories[index];
      const values = factory(this.config.centers[index], this.config.size);
      updater.update(values);
    });
  }
}