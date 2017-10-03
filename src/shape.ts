import { XY, Point } from './lib/ds/xy';
import { Path, PathConfig, MoveTo, QuadraticCurveTo, ClosePath } from './lib/svg/path';
import { Template } from './templates';

export class Shape extends Path {
  constructor(
    config: PathConfig,
    template: Template,
  ) {
    config.data = [
      new MoveTo(template.left),
      new QuadraticCurveTo(template.tl, template.top),
      new QuadraticCurveTo(template.tr, template.right),
      new QuadraticCurveTo(template.br, template.bottom),
      new QuadraticCurveTo(template.bl, template.left),
      new ClosePath(),
    ];
    super(config);
  }
}