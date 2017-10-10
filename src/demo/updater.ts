import { TweenConfig } from '../lib/tween/tween';
import { Tweens } from '../lib/tween/tweens';
import { Template } from './templates';

export class Updater {
  constructor(
    readonly tweens: Tweens,
    readonly config: TweenConfig,
    readonly template: Template,
  ) { }

  update(update: Template) {
    this.tweens
      .tween(this.template.top, update.top, this.config)
      .tween(this.template.right, update.right, this.config)
      .tween(this.template.bottom, update.bottom, this.config)
      .tween(this.template.left, update.left, this.config)
      .tween(this.template.tl, update.tl, this.config)
      .tween(this.template.tr, update.tr, this.config)
      .tween(this.template.br, update.br, this.config)
      .tween(this.template.bl, update.bl, this.config);
  }
}
