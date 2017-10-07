import { make } from './make';
import { XY } from '../ds/xy';
import { Proxy } from './interfaces';

import {
  PathData as DsPathData,
  Path as DsPath,
  PathConfig as DsPathConfig,
  MoveBy as DsMoveBy,
  MoveTo as DsMoveTo,
  LineBy as DsLineBy,
  LineTo as DsLineTo,
  QuadraticCurveTo as DsQuadraticCurveTo,
  QuadraticCurveBy as DsQuadraticCurveBy,
  CubicCurveTo as DsCubicCurveTo,
  CubicCurveBy as DsCubicCurveBy,
  ArcTo as DsArcTo,
  ClosePath as DsClosePath,
} from '../ds/path';

export interface PathData extends DsPathData<string> { }
export interface PathConfig extends DsPathConfig<string> { }

export class Path extends DsPath<string> implements Proxy<SVGPathElement> {
  update(element?: SVGPathElement): SVGPathElement {
    const e = element || make<SVGPathElement>('path');
    draw(this, e);
    return e;
  }
}

export function draw(path: Path, element: SVGPathElement) {
  const d = path.data.map(d => d.write()).join('');
  element.setAttributeNS(null, 'fill', path.fill.toString())
  element.setAttributeNS(null, 'fill-rule', path.fillRule);
  element.setAttributeNS(null, 'stroke', path.stroke.toString());
  element.setAttributeNS(null, 'd', d);

  path.strokeDashArray ?
    element.setAttributeNS(null, 'stroke-dasharray', path.strokeDashArray.join(',')) :
    element.removeAttributeNS(null, 'stroke-dasharray');
}

export class MoveTo extends DsMoveTo<string> {
  write(): string { return `M${writeXY(this.anchor)}`; }
}

export class MoveBy extends DsMoveBy<string> {
  write(): string { return `m${writeXY(this.delta)}`; }
}

export class LineBy extends DsLineBy<string> {
  write(): string { return `l${writeXY(this.delta)}`; }
}

export class LineTo extends DsLineTo<string> {
  write(): string { return `L${writeXY(this.anchor)}`; }
}

export class QuadraticCurveTo extends DsQuadraticCurveTo<string> {
  write(): string { return `Q ${writeXY(this.control)} ${writeXY(this.anchor)}`; }
}

export class QuadraticCurveBy extends DsQuadraticCurveBy<string> {
  write(): string { return `q ${writeXY(this.controlDelta)} ${writeXY(this.anchorDelta)}`; }
}

export class CubicCurveTo extends DsCubicCurveTo<string> {
  write(): string {
    return `C ${writeXY(this.control1)} ${writeXY(this.control2)} ${writeXY(this.anchor)}`;
  }
}

export class CubicCurveBy extends DsCubicCurveBy<string> {
  write(): string {
    return `c ${writeXY(this.control1Delta)} ${writeXY(this.control2Delta)} ${writeXY(this.anchorDelta)}`;
  }
}

export class ArcTo extends DsArcTo<string> {
  write(): string {
    const isLargeArc = this.isLargeArc ? '1' : '0';
    const isSweep = this.isSweep ? '1' : '0';
    const rX = this.radiusX;
    const rY = this.radiusY;
    const xAR = this.xAxisRotate;
    const xy = writeXY(this.anchor);
    return `A ${rX},${rY} ${xAR} ${isLargeArc},${isSweep} ${xy}`;
  }
}

export class ClosePath extends DsClosePath<string> {
  write(): string { return 'Z'; }
}

function writeXY(xy: XY): string {
  return `${xy.x},${xy.y}`;
}