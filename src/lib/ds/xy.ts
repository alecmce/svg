export interface XY {
  x: number;
  y: number;
}

export class Point implements XY {
  constructor(
    public x = 0,
    public y = 0,
  ) { }

  clone() {
    return new Point(this.x, this.y);
  }
}