export interface Ease {
  (p: number): number;
}

export class Back {
  static easeIn(p: number): number {
    return p * p * (2.70158 * p - 1.70158);
  }

  static easeOut(p: number): number {
    return (p -= 1) * p * (2.70158 * p + 1.70158) + 1;
  }

  static easeInOut(p: number): number {
    return (p *= 2) < 1 ?
      .5 * p * p * (3.5949095 * p - 2.5949095) :
      .5 * ((p -= 2) * p * (3.5949095 * p + 2.5949095) + 2);
  }
}

export class Bounce {
  static easeOut(p: number): number {
    if (p < .36363636)
      return 7.5625 * p * p;
    else if (p < .72727272)
      return 7.5625 * (p -= .54545454) * p + .75;
    else if (p < .90909090)
      return 7.5625 * (p -= .81818181) * p + .9375;
    else
      return 7.5625 * (p -= .95454545) * p + .984375;
  }

  static easeIn(p: number): number {
    return 1 - Bounce.easeOut(1 - p);
  }

  static easeInOut(p: number): number {
    return p < .5 ?
      Bounce.easeIn(p * 2) * .5 :
      (Bounce.easeOut(p * 2 - 1) + 1) * .5;
  }
}

export class Circ {
  static easeIn(p: number): number {
    return -Math.sqrt(1 - p * p) + 1;
  }

  static easeOut(p: number): number {
    return Math.sqrt(1 - (p -= 1) * p);
  }

  static easeInOut(p: number): number {
    return (p *= 2) < 1 ?
      -.5 * (Math.sqrt(1 - p * p) - 1) :
      .5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
  }
}

export class Cubic {
  static easeIn(p: number): number {
    return p * p * p;
  }

  static easeOut(p: number): number {
    return (p -= 1) * p * p + 1;
  }

  static easeInOut(p: number): number {
    return (p *= 2) < 1 ?
      .5 * p * p * p :
      ((p -= 2) * p * p + 2) * .5;
  }
}

export class Expo {
  static easeIn(p: number): number {
    return p == 0 ? 0 : Math.pow(2, 10 * (p - 1)) - 0.001;
  }

  static easeOut(p: number): number {
    return p == 1 ? 1 : -Math.pow(2, -10 * p) + 1;
  }

  static easeInOut(p: number): number {
    if (p == 0 || p == 1) return p;
    return (p *= 2) < 1 ?
      .5 * Math.pow(2, 10 * (p - 1)) :
      .5 * (-Math.pow(2, -10 * (p - 1)) + 2);
  }
}

export class Quad {
  static easeIn(p: number): number {
    return p * p;
  }

  static easeOut(p: number): number {
    return -p * (p - 2);
  }

  static easeInOut(p: number): number {
    return (p *= 2) < 1 ?
      .5 * p * p :
      -.5 * ((--p) * (p - 2) - 1);
  }
}

export class Quart {
  static easeIn(p: number): number {
    return p * p * p * p;
  }

  static easeOut(p: number): number {
    return -((p -= 1) * p * p * p - 1);
  }

  static easeInOut(p: number): number {
    return (p *= 2) < 1 ?
      .5 * p * p * p * p :
      -.5 * ((p -= 2) * p * p * p - 2);
  }
}

export class Quint {
  static easeIn(p: number): number {
    return p * p * p * p * p;
  }

  static easeOut(p: number): number {
    return (p -= 1) * p * p * p * p + 1;
  }

  static easeInOut(p: number): number {
    return (p *= 2) < 1 ?
      .5 * p * p * p * p * p :
      .5 * ((p -= 2) * p * p * p * p + 2);
  }
}

const HALF_PI: number = Math.PI * 0.5;

export class Sine {
  static easeIn(p: number): number {
    return 1 - Math.cos(-p * HALF_PI);
  }

  static easeOut(p: number): number {
    return Math.sin(p * HALF_PI);
  }

  static easeInOut(p: number): number {
    return -0.5 * (Math.cos(Math.PI * p) - 1);
  }
}