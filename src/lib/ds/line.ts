import { Color } from '../ds/color';
import { XY } from '../ds/xy';

export class Line {
  constructor(
    public from?: XY,
    public to?: XY,
    public stroke?: Color,
    public width = 2,
  ) { }
}