import * as p from '@p5-wrapper/react';

export class PowerUp {
  color: string;
  xPosition: number;
  yPosition: number;
  p5: p.P5CanvasInstance;
  shouldDraw = false;

  constructor(
    color: string,
    xPosition: number,
    yPosition: number,
    p5: p.P5CanvasInstance
  ) {
    this.color = color;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.p5 = p5;
  }

  setPositionWithinBounds = (
    left: number,
    right: number,
    top: number,
    bottom: number
  ) => {
    this.xPosition = this.p5.random(left, right);
    this.yPosition = this.p5.random(top, bottom);
  };

  checkIfColliding = (x: number, y: number): boolean => {
    if (!this.shouldDraw) {
      return false;
    }
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  };

  remove(): void {
    this.shouldDraw = false;
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    this.p5.push();
    this.p5.fill(this.color);

    this.p5.circle(this.xPosition, this.yPosition, 20);
    this.p5.pop();
  }

  private get boundingBox() {
    const farLeftOfCircle = this.xPosition - 10;
    const farRightOfCircle = this.xPosition + 10;
    const topOfCircle = this.yPosition - 10;
    const bottomOfCircle = this.yPosition + 10;

    return {
      left: farLeftOfCircle,
      right: farRightOfCircle,
      top: topOfCircle,
      bottom: bottomOfCircle,
    };
  }
}
