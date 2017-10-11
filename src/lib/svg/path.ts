import { make } from './make';
import { XY } from '../ds/xy';
import { Color } from '../color/color';
import { NamedColor } from '../color/named';
import { Proxy } from './proxy';
import { Entity, Watch, Resolve } from '../powder';

export interface PathConfig {
  readonly element: SVGPathElement;
  data?: PathData[];
  fill?: Color;
  fillRule?: string;
  stroke?: Color;
  strokeDashArray?: number[];
  width?: number;
}

export class Path implements Proxy<SVGPathElement> {
  readonly element: SVGPathElement;

  @Watch data: PathData[];
  @Watch fill: Color;
  @Watch fillRule: string;
  @Watch stroke: Color;
  @Watch strokeDashArray: number[] | null;
  @Watch width = 2;

  constructor(config: PathConfig) {
    this.element = config.element;
    this.data = config.data || [];
    this.fill = config.fill || new NamedColor('none');
    this.fillRule = config.fillRule || 'even-odd';
    this.stroke = config.stroke || new NamedColor('black');
    this.strokeDashArray = config.strokeDashArray;
    this.width = config.width || 2;
  }

  @Resolve
  resolve() {
    const e = this.element;
    e.setAttributeNS(null, 'fill', this.fill.toString())
    e.setAttributeNS(null, 'fill-rule', this.fillRule);
    e.setAttributeNS(null, 'stroke', this.stroke.toString());
    e.setAttributeNS(null, 'd', this.data.map(d => d.value).join(''));
    this.strokeDashArray ?
      e.setAttributeNS(null, 'stroke-dasharray', this.strokeDashArray.join(',')) :
      e.removeAttributeNS(null, 'stroke-dasharray');
  }
}

export interface PathData {
  value: string;
}

@Entity
export class MoveTo implements PathData {
  @Watch anchor: XY;

  public value: string;
  constructor(anchor: XY) { this.anchor = anchor; }

  @Resolve
  resolve() {
    this.value = `M${writeXY(this.anchor)}`;
  }
}

@Entity
export class MoveBy implements PathData {
  @Watch delta: XY;

  public value: string;
  constructor(delta: XY) { this.delta = delta; }

  @Resolve
  resolve() {
    this.value = `m${writeXY(this.delta)}`;
  }
}

@Entity
export class LineBy implements PathData {
  @Watch delta: XY;

  public value: string;
  constructor(delta: XY) { this.delta = delta; }

  @Resolve
  resolve() {
    this.value = `l${writeXY(this.delta)}`;
  }
}

@Entity
export class LineTo implements PathData {
  @Watch anchor: XY;

  public value: string;
  constructor(anchor: XY) { this.anchor = anchor; }

  @Resolve
  resolve() {
    this.value = `L${writeXY(this.anchor)}`;
  }
}

@Entity
export class QuadraticCurveTo implements PathData {
  @Watch control: XY;
  @Watch anchor: XY;

  public value: string;
  constructor(control: XY, anchor: XY) {
    this.control = control;
    this.anchor = anchor;
  }

  @Resolve
  resolve() {
    this.value = `Q ${writeXY(this.control)} ${writeXY(this.anchor)}`;
  }
}

@Entity
export class QuadraticCurveBy implements PathData {
  @Watch controlDelta: XY;
  @Watch anchorDelta: XY;

  public value: string;
  constructor(
    controlDelta: XY,
    anchorDelta: XY,
  ) {
    this.controlDelta = controlDelta;
    this.anchorDelta = anchorDelta;
  }

  @Resolve
  resolve() {
    this.value = `q ${writeXY(this.controlDelta)} ${writeXY(this.anchorDelta)}`;
  }
}

@Entity
export class CubicCurveTo implements PathData {
  @Watch control1: XY;
  @Watch control2: XY;
  @Watch anchor: XY;

  public value: string;
  constructor(
    control1: XY,
    control2: XY,
    anchor: XY,
  ) {
    this.control1 = control1;
    this.control2 = control2;
    this.anchor = anchor;
  }

  @Resolve
  resolve() {
    this.value = `C ${writeXY(this.control1)} ${writeXY(this.control2)} ${writeXY(this.anchor)}`;
  }
}

@Entity
export class CubicCurveBy implements PathData {
  @Watch control1Delta: XY;
  @Watch control2Delta: XY;
  @Watch anchorDelta: XY;

  public value: string;
  constructor(
    control1Delta: XY,
    control2Delta: XY,
    anchorDelta: XY,
  ) {
    this.control1Delta = control1Delta;
    this.control2Delta = control2Delta;
    this.anchorDelta = anchorDelta;
  }

  @Resolve
  resolve() {
    this.value = `c ${writeXY(this.control1Delta)} ${writeXY(this.control2Delta)} ${writeXY(this.anchorDelta)}`;
  }
}

@Entity
export class ArcTo implements PathData {
  @Watch radiusX: number;
  @Watch radiusY: number;
  @Watch xAxisRotate: number;
  @Watch isLargeArc: boolean;
  @Watch isSweep: boolean;
  @Watch anchor: XY;

  public value: string;
  constructor(
    radiusX: number,
    radiusY: number,
    xAxisRotate: number,
    isLargeArc: boolean,
    isSweep: boolean,
    anchor: XY,
  ) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.xAxisRotate = xAxisRotate;
    this.isLargeArc = isLargeArc;
    this.isSweep = isSweep;
    this.anchor = anchor;
  }

  @Resolve
  resolve() {
    const isLargeArc = this.isLargeArc ? '1' : '0';
    const isSweep = this.isSweep ? '1' : '0';
    const rX = this.radiusX;
    const rY = this.radiusY;
    const xAR = this.xAxisRotate;
    const xy = writeXY(this.anchor);
    this.value = `A ${rX},${rY} ${xAR} ${isLargeArc},${isSweep} ${xy}`;
  }
}

@Entity
export class ClosePath implements PathData {
  readonly value: string = 'z';
}

function writeXY(xy: XY): string {
  return `${xy.x},${xy.y}`;
}