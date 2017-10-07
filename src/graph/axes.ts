import { Color } from '../lib/ds/color';
import { Rect } from '../lib/ds/rect';
import { Point, XY } from '../lib/ds/xy';

import { Path, PathConfig, PathData, MoveTo, LineTo } from '../lib/svg/path';
import { repeat } from '../lib/util';

export interface AxesConfig {
  stroke?: Color,
  strokeDashArray?: number[],
  width?: number, 
}

export class Axes extends Path {
  constructor(
    public source: [XY, XY, XY, XY],
    public config: AxesConfig,
  ) {
    super({
      ...config,
      data: makePath(source), 
    });
  }
}

function makePath(points: [XY, XY, XY, XY]): PathData[]  {
  return [
    new MoveTo(points[0]),
    new LineTo(points[2]),
    new MoveTo(points[1]),
    new LineTo(points[3]),
  ];
}