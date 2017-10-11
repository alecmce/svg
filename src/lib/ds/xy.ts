import { Entity, Watch } from '../powder';

@Entity
export class XY {
  @Watch x: number;
  @Watch y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new XY(this.x, this.y);
  }
}