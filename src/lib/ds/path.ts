import { Color } from '../color/color';
import { NamedColor } from '../color/named';
import { XY } from '../ds/xy';

export interface PathData<T> {
  write(): T;
}

export interface PathConfig<T> {
  data?: PathData<T>[],
  fill?: Color,
  fillRule?: string,
  stroke?: Color,
  strokeDashArray?: number[],
  width?: number,
}

export class Path<T> {
  public data: PathData<T>[];
  public fill: Color;
  public fillRule: string;
  public stroke: Color;
  public strokeDashArray: number[] | null;
  public width = 2;
  constructor(config: PathConfig<T>) {
    this.data = config.data || [];
    this.fill = config.fill || new NamedColor('none');
    this.fillRule = config.fillRule || 'even-odd';
    this.stroke = config.stroke || new NamedColor('black');
    this.strokeDashArray = config.strokeDashArray;
    this.width = config.width || 2;
  }
}

export abstract class MoveBy<T> implements PathData<T> {
  constructor(public delta: XY) { }
  abstract write(): T;
}

export abstract class MoveTo<T> implements PathData<T> {
  constructor(public anchor: XY) { }
  abstract write(): T;
}

export abstract class LineBy<T> implements PathData<T> {
  constructor(public delta: XY) { }
  abstract write(): T;
}

export abstract class LineTo<T> implements PathData<T> {
  constructor(public anchor: XY) { }
  abstract write(): T;
}

export abstract class QuadraticCurveTo<T> implements PathData<T> {
  constructor(
    public control: XY,
    public anchor: XY,
  ) { }
  abstract write(): T;
}

export abstract class QuadraticCurveBy<T> implements PathData<T> {
  constructor(
    public controlDelta: XY,
    public anchorDelta: XY,
  ) { }
  abstract write(): T;
}

export abstract class CubicCurveTo<T> implements PathData<T> {
  constructor(
    public control1: XY,
    public control2: XY,
    public anchor: XY,
  ) { }
  abstract write(): T;
}

export abstract class CubicCurveBy<T> implements PathData<T> {
  constructor(
    public control1Delta: XY,
    public control2Delta: XY,
    public anchorDelta: XY,
  ) { }
  abstract write(): T;
}

export abstract class ArcTo<T> implements PathData<T> {
  constructor(
    public radiusX: number,
    public radiusY: number,
    public xAxisRotate: number,
    public isLargeArc: boolean,
    public isSweep: boolean,
    public anchor: XY,
  ) { }
  abstract write(): T;
}

export abstract class ClosePath<T> implements PathData<T> {
  abstract write(): T;
}