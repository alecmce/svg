import { Color } from './color';
import { Rgb } from './rgb';

export class Hsl implements Color {
  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a = 1.0,
  ) { }

  clone(): Hsl {
    return new Hsl(this.h, this.s, this.l, this.a);
  }

  toRgb(): Rgb {
    return hslToRgb(this);
  }

  toString(): string {
    const H = Math.floor(this.h * 360);
    const S = Math.floor(this.s * 100);
    const L = Math.floor(this.l * 100);
    const A = this.a.toFixed(2);
    return `hsla(${H},${S}%,${L}%,${A})`;
  }
}

export function hslToRgb(hsl: Hsl): Rgb {
  var l = hsl.l
  if (hsl.s == 0) {
    l = Math.round(l * 0xff);
    return new Rgb(l, l, l, hsl.a);
  } else {
    const s = hsl.s;
    const q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    const p = 2 * l - q;
    const r = hueToChannel(p, q, hsl.h + 1 / 3);
    const g = hueToChannel(p, q, hsl.h);
    const b = hueToChannel(p, q, hsl.h - 1 / 3);
    return new Rgb(
      Math.round(r * 0xff),
      Math.round(g * 0xff),
      Math.round(b * 0xff),
      hsl.a,
    );
  }
};

function hueToChannel(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}