import * as p from '@p5-wrapper/react';

export class CompactDisk {
  x: number;
  y: number;
  src: string;
  p5: p.P5CanvasInstance;
  image = null;

  constructor(x: number, y: number, p5: p.P5CanvasInstance, src: string) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.p5 = p5;
  }

  load() {
    this.image = this.p5.loadImage(this.src);
  }

  checkIfColliding(x: number, y: number): boolean {
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  }

  draw() {
    this.p5.push();
    this.p5.imageMode(this.p5.CENTER);
    this.p5.translate(this.x, this.y);
    this.p5.rotateY(this.p5.frameCount * 0.03);
    this.p5.image(this.image, 0, 0, 30, 30);
    this.p5.pop();
  }

  private get boundingBox() {
    const farLeftOfCircle = this.x - 15;
    const farRightOfCircle = this.x + 15;
    const topOfCircle = this.y - 15;
    const bottomOfCircle = this.y + 15;
    return {
      left: farLeftOfCircle,
      right: farRightOfCircle,
      top: topOfCircle,
      bottom: bottomOfCircle,
    };
  }
}
