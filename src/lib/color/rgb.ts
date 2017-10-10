import { Color } from './color';
import { Hsl } from './hsl';

export class Rgb implements Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a = 1.0,
  ) { }

  clone(): Rgb {
    return new Rgb(this.r, this.g, this.b, this.a);
  }

  toHsl(): Hsl {
    return rgbToHsl(this);
  }

  toString(): string {
    const R = Math.floor(this.r);
    const G = Math.floor(this.g);
    const B = Math.floor(this.b);
    return `rgba(${R},${G},${B},${this.a})`;
  }

  static fromString(rrggbb: string): Rgb {
    return new Rgb(
      parseInt(rrggbb.substr(1, 2), 16),
      parseInt(rrggbb.substr(3, 2), 16),
      parseInt(rrggbb.substr(5, 2), 16),
    );
  }
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 0xff;
  const g = rgb.g / 0xff;
  const b = rgb.b / 0xff;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (min + max) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return new Hsl(h, s, l, rgb.a);
}