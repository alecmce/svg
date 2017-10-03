import { make } from './make';
import { Line as DsLine } from '../ds/line';
import { XY } from '../ds/xy';
import { Proxy } from './interfaces';

export class Line extends DsLine implements Proxy<SVGLineElement> {
  update(element?: SVGLineElement): SVGLineElement {
    const e = element || make<SVGLineElement>('line');
    draw(this, e);
    return e;
  }
}

export function draw(line: Line, element: SVGLineElement) {
  element.setAttributeNS(null, 'stroke', line.stroke ? this.stroke.toString() : 'black');
  element.setAttributeNS(null, 'stroke-width', `${line.width}`);
  element.setAttributeNS(null, 'x1', `${line.from.x}`);
  element.setAttributeNS(null, 'y1', `${line.from.y}`);
  element.setAttributeNS(null, 'x2', `${line.to.x}`);
  element.setAttributeNS(null, 'y2', `${line.to.y}`);
}