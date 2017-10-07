import { Color } from '../lib/ds/color';
import { Rect } from '../lib/ds/rect';
import { Point, XY } from '../lib/ds/xy';

import { Path, PathConfig, PathData, MoveTo, LineTo } from '../lib/svg/path';
import { repeat } from '../lib/util';

export interface LineConfig {
  stroke?: Color,
  strokeDashArray?: number[],
  width?: number, 
}

export type FourPoints = [XY, XY, XY, XY];

export class Line extends Path {
  constructor(
    public source: XY[],
    public config: LineConfig,
  ) {
    super({
      ...config,
      data: [], 
    });
  }

  update(element?: SVGPathElement): SVGPathElement {
    this.updateData();
    return super.update(element);
  }

  private updateData() {
    const howManyPointsInPath = this.data.length;
    const howManyPointsInSource = this.source.length;
    const pointDelta = howManyPointsInSource - howManyPointsInPath;
    if (pointDelta > 0) {
      this.appendPath(this.source.slice(howManyPointsInPath), howManyPointsInPath == 0);
    } else if (pointDelta < 0) {
      this.curtailPath(howManyPointsInPath);
    }
  }

  private appendPath(source: XY[], isDataEmpty: boolean) {
    const pathData = source.map((xy, i) =>
      i == 0 && isDataEmpty ? new MoveTo(xy) : new LineTo(xy));
    this.data.push(...pathData);
  }

  private curtailPath(removeFromIndex: number) {
    this.data.splice(removeFromIndex);
  }
}
