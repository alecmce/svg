export interface XY {
  x: number;
  y: number;
}

export class Point implements XY {
  constructor(
    public x: number,
    public y: number,
  ) { }

  clone() {
    return new Point(this.x, this.y);
  }
}