import { Canvas } from '../lib/svg/canvas';
import { Line } from '../lib/svg/line';
import { Rgb } from '../lib/ds/color';
import { Shape } from './shape';
import { Tweens } from '../lib/ds/tweens';
import { Back, Bounce, Circ, Quad } from '../lib/ds/ease';
import { XY, Point } from '../lib/ds/xy';
import { TemplateFactory, Template, controls, blob, square, pin, eye, pie, bullet } from './templates';
import { RotatingConfig, Rotating } from '../demo/rotating';
import { SimpleConfig, Simple } from '../demo/simple';

const DURATION = 1000;
const DELAY = 250;
const CENTER = new Point(0, 0);
const SIZE = 80;
const SMALL_SIZE = 20;
const TWEEN_CONFIG = { duration: DURATION, ease: Quad.easeInOut };
const FACTORIES = [square, blob, pin, eye, pie, bullet];
const COLORS = ['#e67e22', '#2980b9', '#e74c3c', '#27ae60', '#8e44ad', '#f1c40f'].map(Rgb.fromString);
const CENTERS = FACTORIES.map((t, i) => new Point(0, SMALL_SIZE * 3));
const COLOR = COLORS[0].clone();
const WIDTHS = [4, 3, 4, 5, 4, 3];
const COUNT = WIDTHS.reduce((a, b) => a + b);
const OFFSET = 2;
const SMALL_WIDTH = SMALL_SIZE * COUNT;

const { top, left, bottom, right } = blob(CENTER, SIZE);

function updateSizeData() {
  CENTER.x = window.innerWidth / 2;
  CENTER.y = (SIZE + window.innerHeight) / 2;
  const left = (CENTERS.length - SMALL_WIDTH) / 2;
  CENTERS.forEach((p, i) => {
    const dx = OFFSET + WIDTHS.slice(0, i).reduce((a, b) => a + b, 0);
    p.x = CENTER.x + left + dx * SMALL_SIZE;
    p.y = CENTER.y - SIZE * 2.5;
  });
}

export function shapesAndFillsDemo() {
  updateSizeData();
  const canvas = new Canvas(document.body.querySelector('.main') as SVGSVGElement);
  const tweens = new Tweens(() => canvas.update());

  const simple = new Simple(canvas, {
    centers: CENTERS,
    size: SMALL_SIZE,
    tweenConfig: TWEEN_CONFIG,
    tweens,
    factories: FACTORIES,
    colors: COLORS,
    strokeConfig: {
      stroke: new Rgb(0, 0, 0),
      width: 2,
    },
  });

  const rotating = new Rotating(canvas, {
    center: CENTER,
    size: SIZE,
    duration: DURATION,
    delay: DELAY,
    tweenConfig: TWEEN_CONFIG,
    tweens,
    factories: FACTORIES.map((factory, index) => ({ factory, color: COLORS[index] })),
    fillConfig: {
      fill: COLOR,
    },
    strokeConfig: {
      stroke: new Rgb(0, 0, 0),
      width: 2,
    },
  });

  canvas.resize.add(() => {
    updateSizeData();
    simple.update();
  });
};
