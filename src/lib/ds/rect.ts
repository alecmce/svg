export class Rect {
  constructor(
    public top = 0,
    public right = 0,
    public bottom = 0,
    public left = 0,
  ) {}

  getWidth(): number {
    return this.right - this.left;
  }

  getHeight(): number {
    return this.bottom - this.top;
  }
}

export class Padding {
  constructor(
    public top = 0,
    public right = 0,
    public bottom = 0,
    public left = 0,
  ) {}

  getHorizontalPadding(): number {
    return this.left + this.right;
  }

  getVerticalPadding(): number {
    return this.top + this.bottom;
  }
}