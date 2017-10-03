import { XY, Point } from './lib/ds/xy';

interface Anchors {
  top: Point;
  right: Point;
  bottom: Point;
  left: Point;
}

interface Controls {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
}

export interface Template extends Anchors, Controls { }

export interface ControlFactory {
  (center: XY, size: number): Template;
}

export function controls(center: XY, size: number): Controls {
  return {
    tl: new Point(center.x - size, center.y - size),
    tr: new Point(center.x + size, center.y - size),
    br: new Point(center.x + size, center.y + size),
    bl: new Point(center.x - size, center.y + size),
  }
}

export interface TemplateFactory {
  (center: XY, size: number): Template;
}

export function blob(center: XY, size: number): Template {
  return {
    top: new Point(center.x, center.y - size),
    right: new Point(center.x + size, center.y),
    bottom: new Point(center.x, center.y + size),
    left: new Point(center.x - size, center.y),
    ...controls(center, size),
  };
}

export function square(center: XY, size: number): Template {
  return {
    top: new Point(center.x, center.y - size * 2),
    right: new Point(center.x + size * 2, center.y),
    bottom: new Point(center.x, center.y + size * 2),
    left: new Point(center.x - size * 2, center.y),
    ...controls(center, size),
  }
}

export function pin(center: XY, size: number): Template {
  return {
    top: new Point(center.x, center.y - size),
    right: new Point(center.x + size, center.y),
    bottom: new Point(center.x, center.y + size * 2),
    left: new Point(center.x - size, center.y),
    ...controls(center, size),
  };
}

export function eye(center: XY, size: number): Template {
  return {
    top: new Point(center.x, center.y - size),
    right: new Point(center.x + size * 2, center.y),
    bottom: new Point(center.x, center.y + size),
    left: new Point(center.x - size * 2, center.y),
    ...controls(center, size),
  };
}

export function pie(center: XY, size: number): Template {
  return {
    top: new Point(center.x, center.y - size),
    right: new Point(center.x + size * 2, center.y),
    bottom: new Point(center.x, center.y + size * 2),
    left: new Point(center.x - size * 2, center.y),
    ...controls(center, size),
  };
}

export function bullet(center: XY, size: number): Template {
  return {
    top: new Point(center.x, center.y - size),
    right: new Point(center.x + size * 2, center.y),
    bottom: new Point(center.x, center.y + size * 2),
    left: new Point(center.x - size, center.y),
    ...controls(center, size),
  };
}
