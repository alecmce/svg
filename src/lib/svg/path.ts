import { make } from './make';
import { XY } from '../ds/xy';
import { Color } from '../color/color';
import { NamedColor } from '../color/named';
import { Proxy } from './interfaces';
import { Entity } from '../glue';

export interface PathConfig {
  element: SVGPathElement,
  data?: PathData[],
  fill?: Color,
  fillRule?: string,
  stroke?: Color,
  strokeDashArray?: number[],
  width?: number,
}

export class Path {
  readonly element: SVGPathElement;

  data: PathData[];
  fill: Color;
  fillRule: string;
  stroke: Color;
  strokeDashArray: number[] | null;
  width = 2;
  constructor(config: PathConfig) {
    this.element = config.element;

    this.data = config.data || [];
    this.fill = config.fill || new NamedColor('none');
    this.fillRule = config.fillRule || 'even-odd';
    this.stroke = config.stroke || new NamedColor('black');
    this.strokeDashArray = config.strokeDashArray;
    this.width = config.width || 2;
  }

  update() {
    draw(this, this.element);
  }
}

export function draw(path: Path, element: SVGPathElement) {
  const d = path.data.map(d => d.value).join('');
  element.setAttributeNS(null, 'fill', path.fill.toString())
  element.setAttributeNS(null, 'fill-rule', path.fillRule);
  element.setAttributeNS(null, 'stroke', path.stroke.toString());
  element.setAttributeNS(null, 'd', d);

  path.strokeDashArray ?
    element.setAttributeNS(null, 'stroke-dasharray', path.strokeDashArray.join(',')) :
    element.removeAttributeNS(null, 'stroke-dasharray');
}

export abstract class PathData implements Entity {
  value: string;

  abstract update(): void;
}

export class MoveTo extends PathData {
  constructor(public anchor: XY) { super(); }

  update() {
    this.value = `M${writeXY(this.anchor)}`;
  }
}

export class MoveBy extends PathData {
  constructor(public delta: XY) { super(); }

  update() {
    this.value = `m${writeXY(this.delta)}`;
  }
}

export class LineBy extends PathData {
  constructor(public delta: XY) { super(); }

  update() {
    this.value = `l${writeXY(this.delta)}`;
  }
}

export class LineTo extends PathData {
  constructor(public anchor: XY) { super(); }

  update() {
    this.value = `L${writeXY(this.anchor)}`;
  }
}

export class QuadraticCurveTo extends PathData {
  constructor(
    public control: XY,
    public anchor: XY,
  ) { super(); }

  update() {
    this.value = `Q ${writeXY(this.control)} ${writeXY(this.anchor)}`;
  }
}

export class QuadraticCurveBy extends PathData {
  constructor(
    public controlDelta: XY,
    public anchorDelta: XY,
  ) { super(); }

  update() {
    this.value = `q ${writeXY(this.controlDelta)} ${writeXY(this.anchorDelta)}`;
  }
}

export class CubicCurveTo extends PathData {
  constructor(
    public control1: XY,
    public control2: XY,
    public anchor: XY,
  ) { super(); }

  update() {
    this.value = `C ${writeXY(this.control1)} ${writeXY(this.control2)} ${writeXY(this.anchor)}`;
  }
}

export class CubicCurveBy extends PathData {
  constructor(
    public control1Delta: XY,
    public control2Delta: XY,
    public anchorDelta: XY,
  ) { super(); }

  update() {
    this.value = `c ${writeXY(this.control1Delta)} ${writeXY(this.control2Delta)} ${writeXY(this.anchorDelta)}`;
  }
}

export class ArcTo extends PathData {
  constructor(
    public radiusX: number,
    public radiusY: number,
    public xAxisRotate: number,
    public isLargeArc: boolean,
    public isSweep: boolean,
    public anchor: XY,
  ) { super(); }

  update() {
    const isLargeArc = this.isLargeArc ? '1' : '0';
    const isSweep = this.isSweep ? '1' : '0';
    const rX = this.radiusX;
    const rY = this.radiusY;
    const xAR = this.xAxisRotate;
    const xy = writeXY(this.anchor);
    this.value = `A ${rX},${rY} ${xAR} ${isLargeArc},${isSweep} ${xy}`;
  }
}

export class ClosePath extends PathData {
  update() {
    this.value = 'Z';
  }
}

function writeXY(xy: XY): string {
  this.value = `${xy.x},${xy.y}`;
}