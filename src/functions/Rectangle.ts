import p5Type from 'p5';
import { getRandomNumber } from './getRandomNumber';
import { STAR_WIDTH } from './Star';

export class FallingRectangle {
  p5: p5Type;
  width: number;
  height = 20;
  colour = 'black';
  stroke = 'white';
  xPosition: number;
  yPosition: number;
  initialY: number;
  shouldDraw = false;
  shouldAnimate = true;

  constructor({
    p5,
    width,
    yOffset,
  }: {
    p5: p5Type;
    width: number;
    yOffset: number;
  }) {
    this.p5 = p5;
    this.width = width;
    this.xPosition = this.randomX;
    const y = -innerHeight / 2 - this.height / 2 - yOffset;
    this.yPosition = y;
    this.initialY = y;
  }

  draw(): void {
    if (!this.shouldDraw) return;
    this.p5.push();
    this.p5.fill(this.colour);
    if (this.stroke) this.p5.stroke(this.stroke);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.xPosition, this.yPosition, this.width, this.height);
    this.yPosition = this.shouldAnimate
      ? (this.yPosition += 2)
      : this.yPosition;
    if (this.yPosition - this.height / 2 > this.p5.height) {
      this.shouldDraw = false;
    }
    this.p5.pop();
  }

  reset() {
    this.shouldAnimate = false;
    this.shouldDraw = false;
    this.yPosition = this.initialY;
    this.xPosition = this.randomX;
  }

  checkIfColliding = (x: number, y: number): boolean => {
    if (!this.shouldDraw) {
      return false;
    }
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  };

  private get boundingBox() {
    const left = this.xPosition - this.width / 2;
    const right = this.xPosition + this.width / 2;
    const top = this.yPosition - this.height / 2;
    const bottom = this.yPosition + this.height / 2;

    return {
      left,
      right,
      top,
      bottom,
    };
  }

  private get randomX() {
    if (this.width === innerWidth) {
      return 0;
    }
    if (this.width >= innerWidth - STAR_WIDTH) {
      return getRandomNumber(-innerWidth / 2, -STAR_WIDTH);
    }
    return getRandomNumber(-innerWidth / 2, innerWidth / 2);
  }
}
