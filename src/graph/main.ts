import { Canvas } from '../lib/svg/canvas';
import { AxesConfig, Axes } from './axes';
import { LineConfig, Line } from './line';
import { XY, Point } from '../lib/ds/xy';
import { Rect, Padding } from '../lib/ds/rect';
import { Rgb } from '../lib/ds/color';
import { repeat } from '../lib/util';
import { Model } from './model';

const CENTER = new Point();
const BOUNDS = new Rect();
const PADDING = new Padding(30, 30, 30, 30);
const AXIS_POINTS = makePoints();

export function main() {
  const model = new Model(BOUNDS, [
    new Point(0, 0),
    new Point(10, 2),
    new Point(20, 18),
    new Point(30, 20),
  ]);

  const axes = new Axes(model.axis, {
    stroke: new Rgb(0, 0, 0),
    width: 2,
  });

  const line = new Line(model.data, {
    stroke: new Rgb(255, 0, 0),
    width: 2,
  });
  
  const canvas = new Canvas(document.body.querySelector('.main') as SVGSVGElement);
  canvas.append(axes);
  canvas.append(line);

  function update() {
    onResize();
    model.update();
    canvas.update();
  }

  update();
  canvas.resize.add(update);
}

function makePoints(): [XY, XY, XY, XY] {
  return repeat<XY>(4, () => new Point(0, 0)) as [XY, XY, XY, XY]
}

function onResize() {
  BOUNDS.left = PADDING.left;
  BOUNDS.top = PADDING.top;
  BOUNDS.right = window.innerWidth - PADDING.getHorizontalPadding();
  BOUNDS.bottom = window.innerHeight - PADDING.getVerticalPadding();
  updateAxisPoints(BOUNDS, AXIS_POINTS);
  CENTER.x = window.innerWidth / 2;
  CENTER.y = window.innerHeight / 2;
}

function updateAxisPoints(bounds: Rect, points: [XY, XY, XY, XY]) {
  const originX = (bounds.left + bounds.right) / 2;
  const originY = (bounds.top + bounds.bottom) / 2;
  points[0].x = originX;
  points[0].y = bounds.top;
  points[1].x = bounds.right;
  points[1].y = originY;
  points[2].x = originX;
  points[2].y = bounds.bottom;    
  points[3].x = bounds.left;
  points[3].y = originY;
}