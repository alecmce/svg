export interface Color {
  toString(): string;
}

export class NamedColor implements Color {
  constructor(readonly name: string) { }

  toString(): string {
    return this.name;
  }
}

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