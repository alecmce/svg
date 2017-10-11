import { make } from './make';
import { Color } from '../color/color';
import { XY } from '../ds/xy';
import { Proxy } from './proxy';
import { Entity, Watch, Resolve } from '../powder';

export interface LineConfig {
  readonly element: SVGLineElement;
  from?: XY;
  to?: XY;
  stroke?: Color;
  width?: number;
}

@Entity
export class Line implements Proxy<SVGLineElement> {
  readonly element: SVGLineElement;

  @Watch from: XY;
  @Watch to: XY;
  @Watch stroke: Color;
  @Watch width = 2;

  constructor(config: LineConfig) {
    this.element = config.element;
    this.from = config.from;
    this.to = config.to;
    this.stroke = config.stroke;
    this.width = config.width;
  }

  @Resolve
  resolve() {
    const e = this.element;
    e.setAttributeNS(null, 'stroke', this.stroke ? this.stroke.toString() : 'black');
    e.setAttributeNS(null, 'stroke-width', `${this.width}`);
    e.setAttributeNS(null, 'x1', `${this.from.x}`);
    e.setAttributeNS(null, 'y1', `${this.from.y}`);
    e.setAttributeNS(null, 'x2', `${this.to.x}`);
    e.setAttributeNS(null, 'y2', `${this.to.y}`);
  }
}
