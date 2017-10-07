import { XY, Point } from '../lib/ds/xy';
import { Rect } from '../lib/ds/rect';
import { repeat, Create, Update, Sync } from '../lib/util';

type CreateXY = Create<XY, XY>;
type UpdateXY = Update<XY, XY>;

/**
 * The model does ...
 */
export class Model {
  public axis: [XY, XY, XY, XY] = makeAxisPoints();
  public data: XY[] = [];
  public origin: XY = new Point(0, 0);

  constructor(
    public bounds: Rect,
    private source: XY[],
  ) { }

  setSource(source: XY[]) {
    this.source = source;
    this.update();
    this.updateAxis();
  }

  private updateAxis() {
    this.axis[0].x = this.origin.x;
    this.axis[0].y = this.bounds.top;
    this.axis[1].x = this.bounds.right;
    this.axis[1].y = this.origin.y;
    this.axis[2].x = this.origin.x;
    this.axis[2].y = this.bounds.bottom;
    this.axis[3].x = this.bounds.left;
    this.axis[3].y = this.origin.y;
  }

  update() {
    new ModelUpdater(this.bounds, this.source, this.data, this.origin);
  }
}

function makeAxisPoints(): [XY, XY, XY, XY] {
  return repeat<XY>(4, () => new Point(0, 0)) as [XY, XY, XY, XY];
}

class ModelUpdater {
  private readonly xRange: Range;
  private readonly yRange: Range;
  constructor(
    readonly bounds: Rect,
    readonly input: XY[],
    readonly output: XY[],
    readonly origin: XY,
  ) {
    this.xRange = getRange(input, xy => xy.x);
    this.yRange = getRange(input, xy => xy.y);
    this.syncData();
    this.updateXY(new Point(0, 0), origin);
  }

  private syncData() {
    new Sync<XY, XY>(
      (input) => this.createXY(input),
      (input, output) => this.updateXY(input, output),
    ).apply(this.input, this.output);
  }

  private updateXY(input: XY, output: XY) {
    const xp = (input.x - this.xRange.min) / this.xRange.range;
    const yp = (input.y - this.yRange.min) / this.yRange.range;
    output.x = this.bounds.left + this.bounds.getWidth() * xp;
    output.y = this.bounds.bottom - this.bounds.getHeight() * yp;
  }

  private createXY(input: XY): XY {
    const pt = new Point();
    this.updateXY(input, pt);
    return pt;
  }
}

interface Range {
  min: number,
  max: number,
  range: number,
}

function getRange(source: XY[], fn: (xy: XY) => number): Range {
  const values = source.map(fn);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  return {min, max, range};
}